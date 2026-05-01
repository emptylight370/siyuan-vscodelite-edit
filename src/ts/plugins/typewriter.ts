import { getMsg } from "../api";

/** 上一次滚动时间 */
let lastScrollTime = 0;
/** 最小触发间隔(ms) */
const SCROLL_THROTTLE_MS = 300;

/**
 * 处理打字机模式的滚动逻辑
 * 从光标位置向上查找最近的 [data-node-id] 块元素，并滚动到视口中央
 * @since 3.0.0
 * @version 3.0.0
 */
function scrollToCenter(sourceElement?: HTMLElement): void {
    // 触发前节流检查
    const now = performance.now();
    if (now - lastScrollTime < SCROLL_THROTTLE_MS) return;
    lastScrollTime = now;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!range.collapsed) return; // 有选区时不滚动

    // 获取当前光标所在元素
    let currentTargetElement: HTMLElement = sourceElement ? sourceElement : (range.startContainer as HTMLElement);
    if (!sourceElement) {
        // 键盘事件没传入元素
        let node: Node | null = range.startContainer;
        while (node && node !== document.body) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                currentTargetElement = node as HTMLElement;
                break;
            }
            node = node.parentNode;
        }
    }

    // 如果点击的元素为分隔符，则跳过
    if (currentTargetElement.classList.contains("fn__space")) return;
    else if (currentTargetElement.classList.contains("fn__flex-1")) return;
    // 如果点击的元素为数据库视图栏，则跳过
    else if (currentTargetElement.classList.contains("av__views")) return;
    // 如果点击的元素是个按钮，则跳过
    else if (currentTargetElement.closest(".block__icon")) return;
    else if (currentTargetElement.closest(".protyle-icons")) return;

    // 从光标位置的容器节点向上查找最近的 [data-node-id] 元素
    let targetElement: HTMLElement | null = currentTargetElement.closest("[data-node-id]") as HTMLElement;

    if (!targetElement) return;

    // ===== 表格特殊处理 =====
    let actualTarget: HTMLElement = targetElement;
    if (currentTargetElement.closest("table")) {
        // 以行为目标居中
        const tr = currentTargetElement.closest("tr");
        if (tr) {
            actualTarget = tr;
        } else if (currentTargetElement.tagName === "CAPTION") {
            // 如果点击的是表题就以表题为目标居中
            actualTarget = currentTargetElement;
        }
    }
    // ===== 表格处理结束 =====
    // ===== 数据库特殊处理 =====
    else if (currentTargetElement.closest(".av")) {
        if (
            currentTargetElement.classList.contains("av__cell") ||
            currentTargetElement.classList.contains("av__celltext")
        ) {
            // 从光标位置往上找 .av__row
            let rowElement: HTMLElement | null = currentTargetElement.closest("div.av__row");
            if (!rowElement) {
                // 上面是表格视图，下面是卡片、看板视图
                rowElement = currentTargetElement.closest("div.av__gallery-field");
            }
            if (rowElement) {
                actualTarget = rowElement;
            }
        } else if (currentTargetElement.classList.contains("av__cursor")) {
            // 键盘方向键在数据库表格视图移动
            const cellElement = currentTargetElement.parentElement?.querySelector(".av__cell--select.av__cell--active");
            if (cellElement) {
                actualTarget = (cellElement as HTMLElement).closest(".av__row") as HTMLElement;
            }
        } else if (currentTargetElement.classList.contains("av__gallery-name")) {
            // 卡片视图的字段名
            const rowElement: HTMLElement | null = currentTargetElement.closest("div.av__gallery-field");
            if (rowElement) {
                actualTarget = rowElement;
            }
        } else if (currentTargetElement.classList.contains("av__gallery-cover")) {
            // 卡片视图的封面图
            const targetElement = currentTargetElement.closest(".av__gallery-item");
            if (targetElement) {
                actualTarget = targetElement as HTMLElement;
            }
        } else if (currentTargetElement.closest(".av__gallery-cover")) {
            // 显示文字内容作为预览图
            const targetElement = currentTargetElement.closest(".av__gallery-item");
            if (targetElement) {
                actualTarget = targetElement as HTMLElement;
            }
        } else if (currentTargetElement.classList.contains("av__title")) {
            // 编辑数据库名称
            actualTarget = currentTargetElement;
        } else if (currentTargetElement.closest(".av__header")) {
            // 数据库右上角的按钮，除名称之外
            return;
        } else if (currentTargetElement.classList.contains("b3-chip")) {
            if (currentTargetElement.parentElement?.classList.contains("av__group-name")) {
                // 数据库分组名
                const targetElement = currentTargetElement.closest(".av__group-title") as HTMLElement;
                if (targetElement) {
                    actualTarget = targetElement;
                }
            } else if (currentTargetElement.parentElement?.classList.contains("av__cell")) {
                // 数据库单选字段，跟前面av__cell逻辑一样
                // 从光标位置往上找 .av__row
                let rowElement: HTMLElement | null = currentTargetElement.closest("div.av__row");
                if (!rowElement) {
                    // 上面是表格视图，下面是卡片、看板视图
                    rowElement = currentTargetElement.closest("div.av__gallery-field");
                }
                if (rowElement) {
                    actualTarget = rowElement;
                }
            }
        } else if (currentTargetElement.classList.contains("av__group-title")) {
            // 数据库分组标题
            actualTarget = currentTargetElement;
        } else if (currentTargetElement.classList.contains("av__row")) {
            // 数据库表格视图的行
            actualTarget = currentTargetElement;
        } else if (currentTargetElement.closest(".av__firstcol")) {
            // 数据库前面的复选框
            const targetElement = currentTargetElement.closest(".av__row");
            if (targetElement) {
                actualTarget = targetElement as HTMLElement;
            }
        }
    }
    // ===== 数据库处理结束 =====
    // ===== 代码块特殊处理 =====
    else if (currentTargetElement.closest(".hljs")) {
        actualTarget = currentTargetElement.closest(".hljs") as HTMLElement;
    }
    // ===== 代码块处理结束 =====

    actualTarget.scrollIntoView({ block: "center", behavior: "smooth" });
}

/**
 * 键盘事件处理器
 * 只处理方向键和 Enter 键
 * @since 3.0.0
 * @version 3.0.0
 */
function handleKeydown(event: KeyboardEvent): void {
    const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Backspace"];
    if (!validKeys.includes(event.key)) return;

    // 仅在编辑器内触发
    const target = event.target as HTMLElement;
    if (!target?.closest(".protyle-wysiwyg")) return;

    // 使用 requestAnimationFrame 确保 DOM 已更新后再计算位置
    requestAnimationFrame(() => {
        scrollToCenter();
    });
}

/**
 * 鼠标点击事件处理器
 * @since 3.0.0
 * @version 3.0.0
 */
function handleClick(event: MouseEvent): void {
    // 仅响应鼠标左键
    if (event.button !== 0) return;

    // 仅在编辑器内触发
    const target = event.target as HTMLElement;
    if (!target?.closest(".protyle-wysiwyg")) return;
    // 如果点击的元素是引用和链接，则跳过
    if (target.dataset.type === "block-ref" || target.dataset.type === "a") return;

    // 使用 requestAnimationFrame 确保光标已定位
    requestAnimationFrame(() => {
        scrollToCenter(target);
    });
}

/**
 * 初始化打字机模式
 * 在所有 .protyle-wysiwyg 编辑器上绑定事件监听
 * @since 3.0.0
 * @version 3.0.0
 */
export function initTypewriterMode(): void {
    // 使用事件委托，在 document 上监听，但内部过滤 .protyle-wysiwyg 范围
    document.addEventListener("keydown", handleKeydown, true); // 捕获阶段
    document.addEventListener("click", handleClick, true); // 捕获阶段

    console.log(getMsg("typewriterON"));
}

/**
 * 销毁打字机模式
 * 移除事件监听器
 * @since 3.0.0
 * @version 3.0.0
 */
export function destroyTypewriterMode(): void {
    document.removeEventListener("keydown", handleKeydown, true);
    document.removeEventListener("click", handleClick, true);

    lastScrollTime = 0;
    console.log(getMsg("typewriterOFF"));
}
