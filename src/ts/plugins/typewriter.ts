import { getMsg } from "../api";

/** 上一次滚动时间 */
let lastScrollTime = 0;
/** 最小触发间隔(ms) */
const SCROLL_THROTTLE_MS = 300;
/** rAF 标识，防止同一帧内重复调度滚动 */
let pendingScrollRAF = 0;

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
    // 如果多选数据库表格视图单元格，则跳过
    else if (currentTargetElement.classList.contains("av__body")) return;
    // 如果点击的元素是数据库添加按钮，则跳过
    else if (currentTargetElement.classList.contains("av__gallery-add")) return;
    // 如果点击的元素是个按钮，则跳过
    else if (currentTargetElement.closest(".block__icon, .protyle-icons, .av__gallery-actions")) return;

    // 从光标位置的容器节点向上查找最近的 [data-node-id] 元素
    const targetElement = currentTargetElement.closest<HTMLElement>("[data-node-id]");

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
        const attributeView = currentTargetElement.closest<HTMLElement>(".av");
        if (!attributeView) return;
        let skip = false;

        // 数据库的通用组件
        if (currentTargetElement.classList.contains("av__title")) {
            // 编辑数据库名称
            actualTarget = currentTargetElement;
            skip = true;
        } else if (currentTargetElement.closest(".av__header, .av__row-actions")) {
            // 数据库右上角的按钮，除名称之外
            // 数据库表格视图的主键菜单
            return;
        } else if (currentTargetElement.closest(".av__group-title")) {
            // 数据库分组一整行
            actualTarget = currentTargetElement.closest<HTMLElement>(".av__group-title")!;
            skip = true;
        }

        // 判断数据库类型
        // 表格视图
        if (attributeView.dataset.avType === "table" && !skip) {
            if (
                // 单元格
                currentTargetElement.classList.contains("av__cell") ||
                // 单元格里面的文本
                currentTargetElement.classList.contains("av__celltext") ||
                // 单元格里面的东西
                currentTargetElement.parentElement?.classList.contains("av__cell") ||
                // 直接点中行
                currentTargetElement.classList.contains("av__row") ||
                // 每行前面的复选框
                currentTargetElement.closest(".av__firstcol")
            ) {
                actualTarget = currentTargetElement.closest<HTMLElement>("div.av__row")!;
            } else if (currentTargetElement.classList.contains("av__cursor")) {
                // 键盘方向键在单元格间移动
                const cellElement = currentTargetElement.parentElement?.querySelector(
                    ".av__cell--select.av__cell--active",
                );
                if (cellElement) {
                    actualTarget = (cellElement as HTMLElement).closest<HTMLElement>(".av__row")!;
                }
            } else if (currentTargetElement.closest(".av__row--footer, .av__row--util")) {
                // 底部的统计
                // 底部的加载更多
                return;
            }
        }
        // 卡片视图、看板视图
        else if ((attributeView.dataset.avType === "gallery" || attributeView.dataset.avType === "kanban") && !skip) {
            if (
                // 单元格
                currentTargetElement.classList.contains("av__cell") ||
                // 单元格里面的文本
                currentTargetElement.classList.contains("av__celltext") ||
                // 单元格里面的东西
                currentTargetElement.parentElement?.classList.contains("av__cell")
            ) {
                actualTarget = currentTargetElement.closest<HTMLElement>("div.av__gallery-field")!;
            } else if (currentTargetElement.classList.contains("av__gallery-name")) {
                // 字段名
                actualTarget = currentTargetElement.closest<HTMLElement>("div.av__gallery-field")!;
            } else if (currentTargetElement.closest(".av__gallery-cover")) {
                // 封面图
                actualTarget = currentTargetElement.closest<HTMLElement>(".av__gallery-cover")!;
            } else if (
                // 卡片视图的空白
                currentTargetElement.classList.contains("av__gallery")
            ) {
                if (attributeView.dataset.avType === "gallery") {
                    // 卡片视图是行
                    actualTarget = currentTargetElement;
                } else if (attributeView.dataset.avType === "kanban") {
                    // 看板视图是列
                    return;
                }
            } else if (
                // 看板视图的空白
                currentTargetElement.classList.contains("av__kanban") ||
                // 看板视图的空白
                currentTargetElement.classList.contains("av__kanban-group")
            ) {
                return;
            }
        }
    }
    // ===== 数据库处理结束 =====
    // ===== 代码块特殊处理 =====
    else if (currentTargetElement.closest(".hljs")) {
        return;
    }
    // ===== 代码块处理结束 =====

    lastScrollTime = performance.now();
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

    // 取消上一帧的待处理滚动，避免 rAF 堆积
    if (pendingScrollRAF) cancelAnimationFrame(pendingScrollRAF);
    pendingScrollRAF = requestAnimationFrame(() => {
        pendingScrollRAF = 0;
        scrollToCenter();
    });
}

/**
 * 鼠标点击事件处理器
 * @since 3.0.0
 * @version 3.0.1
 */
function handleClick(event: MouseEvent): void {
    // 仅响应鼠标左键
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    // 仅在编辑器内触发
    if (!target?.closest(".protyle-wysiwyg")) return;
    // 如果点击的元素是引用和链接，则跳过
    const dataType = target.dataset.type?.split(" ");
    if (dataType?.includes("block-ref") || dataType?.includes("a")) return;
    // 在选中不可编辑元素时检查
    if (target.contentEditable === "false") {
        // 多选单元格
        if (target.parentElement?.classList.contains("table")) {
            return;
        }
    }

    // 使用 requestAnimationFrame 确保光标已定位
    if (pendingScrollRAF) cancelAnimationFrame(pendingScrollRAF);
    pendingScrollRAF = requestAnimationFrame(() => {
        pendingScrollRAF = 0;
        scrollToCenter(target);
    });
}

/**
 * 初始化打字机模式
 * 在所有 .protyle-wysiwyg 编辑器上绑定事件监听
 * @since 3.0.0
 * @version 3.0.1
 */
export function initTypewriterMode(): void {
    // 如果已有激活的 AbortController（来自上一次模块加载），先 abort
    if (globalThis.vscTypewriterAbort) {
        globalThis.vscTypewriterAbort.abort();
    }

    globalThis.vscTypewriterAbort = new AbortController();
    const { signal } = globalThis.vscTypewriterAbort;

    // 使用事件委托，在 document 上监听，但内部过滤 .protyle-wysiwyg 范围
    document.addEventListener("keydown", handleKeydown, { capture: true, signal });
    document.addEventListener("click", handleClick, { capture: true, signal });

    console.log(getMsg("typewriterON"));
}

/**
 * 销毁打字机模式
 * 移除事件监听器
 * @since 3.0.0
 * @version 3.0.1
 */
export function destroyTypewriterMode(): void {
    if (!globalThis.vscTypewriterAbort) return;

    // abort() 会移除所有通过此 signal 注册的监听器，无需手动 removeEventListener
    globalThis.vscTypewriterAbort.abort();
    globalThis.vscTypewriterAbort = null;

    // 清理待处理的 rAF 和所有状态
    if (pendingScrollRAF) {
        cancelAnimationFrame(pendingScrollRAF);
        pendingScrollRAF = 0;
    }
    lastScrollTime = 0;
    console.log(getMsg("typewriterOFF"));
}
