/**
 * 添加监听器以观察`/`菜单是否显示
 * 仅在斜杠菜单数量变化时由 theme.ts 的定时器调用
 * @since 2.6.2
 * @version 3.1.8
 */
export function slashMenuObserver() {
    const slashMenus = Array.from(document.querySelectorAll("div.protyle-hint.hint--menu"));
    if (slashMenus.length > 0) {
        if (globalThis.vscObservers.slashDisplayObserver !== null) {
            globalThis.vscObservers.slashDisplayObserver.disconnect();
        } else {
            globalThis.vscObservers.slashDisplayObserver = new MutationObserver(function (mutationsList) {
                for (const mutation of mutationsList) {
                    if (mutation.type === "attributes" && mutation.attributeName === "class") {
                        const slashMenu = mutation.target as HTMLDivElement;
                        if (slashMenu.classList.contains("fn__none")) {
                            // 隐藏时去除按键监听
                            window.removeEventListener("keydown", SlashArrowMoveListener, true);
                        } else {
                            // 显示时添加按键监听
                            window.addEventListener("keydown", SlashArrowMoveListener, true);
                        }
                    }
                }
            });
        }
        // 观察斜杠菜单元素变化，跳过已脱离DOM的元素
        for (const slashMenu of slashMenus) {
            if (!slashMenu.isConnected) continue;
            globalThis.vscObservers.slashDisplayObserver.observe(slashMenu, {
                attributes: true,
                attributeFilter: ["class"],
            });
        }
        // 自行触发一次事件监听器
        if (slashMenus.every((menu) => menu.classList.contains("fn__none"))) {
            window.removeEventListener("keydown", SlashArrowMoveListener, true);
        } else {
            window.addEventListener("keydown", SlashArrowMoveListener, true);
        }
    } else {
        // 斜杠菜单全部消失（该编辑器显示了其他类型的提示）时清理观察器与按键监听
        globalThis.vscObservers.slashDisplayObserver?.disconnect();
        globalThis.vscObservers.slashDisplayObserver = null;
        window.removeEventListener("keydown", SlashArrowMoveListener, true);
    }
}

/**
 * `/`菜单的`keydown`监听器
 * @since 2.6.2
 * @version 2.7.7
 */
function SlashArrowMoveListener(event: KeyboardEvent) {
    // 按键不是左方向键或右方向键时返回
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();

    const slashMenu = Array.from(document.querySelectorAll("div.protyle-hint.hint--menu")).find(
        (menu) => !(menu as HTMLDivElement).classList.contains("fn__none"),
    ) as HTMLDivElement;
    const currentActive = slashMenu.querySelector("button.b3-list-item--focus") as HTMLButtonElement;
    const menuItems = Array.from(document.querySelectorAll("button.b3-list-item.b3-list-item--two"));

    const currentRect = currentActive.getBoundingClientRect();
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;

    let targetElement: HTMLButtonElement | null = null;
    let minDistance = Infinity;

    if (event.key == "ArrowLeft") {
        for (const item of menuItems) {
            if (item === currentActive) continue;

            const itemRect = (item as HTMLButtonElement).getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const itemCenterY = itemRect.top + itemRect.height / 2;

            // 元素在左一列就进行检查
            if (itemCenterX < currentCenterX) {
                // 计算与当前元素中心点的距离
                const distance = Math.sqrt(
                    Math.pow(itemCenterX - currentCenterX, 2) + Math.pow(itemCenterY - currentCenterY, 2),
                );

                // 找到最近的元素
                if (distance < minDistance) {
                    minDistance = distance;
                    targetElement = item as HTMLButtonElement;
                }
            }
        }
    } else if (event.key == "ArrowRight") {
        // 倒序检查元素以加快检查速度
        for (const item of [...menuItems].reverse()) {
            if (item === currentActive) continue;

            const itemRect = (item as HTMLButtonElement).getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const itemCenterY = itemRect.top + itemRect.height / 2;

            // 元素在右一列就进行检查
            if (itemCenterX > currentCenterX) {
                // 计算与当前元素中心点的距离
                const distance = Math.sqrt(
                    Math.pow(itemCenterX - currentCenterX, 2) + Math.pow(itemCenterY - currentCenterY, 2),
                );

                // 找到最近的元素
                if (distance < minDistance) {
                    minDistance = distance;
                    targetElement = item as HTMLButtonElement;
                }
            }
        }
    }

    // 如果找到了目标元素，则将焦点移到该元素上
    if (targetElement) {
        currentActive.classList.remove("b3-list-item--focus");
        targetElement.classList.add("b3-list-item--focus");
    }
}

/**
 * 检查当前斜杠菜单数量
 * @returns 当前斜杠菜单数量
 * @since 2.6.2
 * @version 2.6.2
 */
export function getSlashMenusCount() {
    return document.querySelectorAll("div.protyle-hint.hint--menu").length;
}

/**
 * 销毁斜杠菜单相关的监听器与观察器，主题切换时由 destroyTheme 调用
 * @since 3.1.8
 */
export function destroySlashMenu() {
    globalThis.vscObservers.slashDisplayObserver?.disconnect();
    globalThis.vscObservers.slashDisplayObserver = null;
    window.removeEventListener("keydown", SlashArrowMoveListener, true);
}
