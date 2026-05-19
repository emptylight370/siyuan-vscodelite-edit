/**
 * 获取背景图片元素
 * @returns HTMLElement
 * @since 3.0.0
 * @version 3.0.0
 */
function getBgLayer() {
    return document.getElementById("bglayer");
}

/**
 * 获取背景视频元素
 * @returns HTMLElement
 * @since 3.0.0
 * @version 3.0.0
 */
function getBgVideo() {
    return document.getElementById("bgvideo");
}

/**
 * 判断当前背景插件是否显示
 * @returns boolean
 * @since 3.0.0
 * @version 3.0.0
 */
function isBgVisible() {
    const layer = getBgLayer();
    const video = getBgVideo();
    if (layer?.style.display !== "none" || video?.style.display !== "none") {
        return true;
    } else {
        return false;
    }
}

/**
 * 判断背景插件是否启用
 * @returns boolean
 * @since 3.0.0
 * @version 3.0.0
 */
function isBgEnable() {
    const layer = getBgLayer();
    const video = getBgVideo();
    if (layer || video) return true;
    else return false;
}

/**
 * 检测背景图片插件是否在运行
 * @param times 运行次数
 * @since 1.3.5
 * @version 3.0.0
 */
export function bg(times: number) {
    // 背景自定义插件，部分情况下插件加载缓慢可重复检测一次
    const isEnabled = isBgEnable();
    if (isEnabled) {
        const isVisible = isBgVisible();
        if (isVisible) {
            document.body.classList.add("bgenable");
        } else {
            // console.log("disable background");
            document.body.classList.remove("bgenable");
        }
        // 刚开始每2秒重新检测状态，检测10秒
        if (times < 5) {
            globalThis.vscTimers.bgTimer = window.setTimeout(bg, 2000, times + 1);
        } else {
            globalThis.vscTimers.bgTimer = null;
        }
        if (globalThis.vscObservers.bgExistObserver === null) {
            bgExistObserver();
        }
    } else {
        if (times === 0 || times === 1) {
            // 未启用插件3秒后重新检测两遍
            setTimeout(bg, 3000, times + 1);
        } else {
            // 检测不到背景图移除属性
            document.body.classList.remove("bgenable");
        }
    }
}

/**
 * 监听背景图片插件的属性修改
 * @param times 运行次数
 * @since 1.4.0
 * @version 3.0.0
 */
export function bgObserve(times: number) {
    const isEnabled = isBgEnable();
    if (isEnabled) {
        if (globalThis.vscObservers.bgObserver) {
            globalThis.vscObservers.bgObserver.disconnect();
        }
        globalThis.vscObservers.bgObserver = new MutationObserver(function (mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    // 样式发生变化时执行的代码
                    bg(0);
                }
            }
        });
        const bglayer = getBgLayer();
        if (bglayer) {
            globalThis.vscObservers.bgObserver.observe(bglayer as HTMLElement, {
                attributes: true, // 监听属性变化
                attributeFilter: ["style"], // 只监听 style 属性
            });
        }
        const bgvideo = getBgVideo();
        if (bgvideo) {
            globalThis.vscObservers.bgObserver.observe(bgvideo as HTMLElement, {
                attributes: true,
                attributeFilter: ["style"],
            });
        }
        globalThis.vscTimers.bgObserTimer = null;
    } else {
        // if (times == 0 && !document.body.classList.contains('vscmobile')) {
        if (times === 0) {
            // 运行失败等待5秒
            globalThis.vscTimers.bgObserTimer = window.setTimeout(bgObserve, 5000, 1);
        } else if (times === 1) {
            console.error("背景插件监听失败，修改插件启用状态需手动刷新");
            globalThis.vscTimers.bgObserTimer = null;
        }
    }
}

/**
 * 检测背景是否被移除（插件关闭）
 * @since 2.6.1
 * @version 3.0.0
 */
function bgExistObserver() {
    const bglayer = getBgLayer();
    const bgvideo = getBgVideo();
    let parent = null;
    if (bglayer || bgvideo) {
        parent = bglayer?.parentElement || bgvideo?.parentElement;
        if (globalThis.vscObservers.bgExistObserver) {
            globalThis.vscObservers.bgExistObserver.disconnect();
        }
        if (!parent) return;
        globalThis.vscObservers.bgExistObserver = new MutationObserver(function (mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if ((node as HTMLElement).id === "bglayer" || (node as HTMLElement).id === "bgvideo") {
                                bg(0);
                                return;
                            }
                        }
                    });
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if ((node as HTMLElement).id === "bglayer" || (node as HTMLElement).id === "bgvideo") {
                                bg(2);
                                return;
                            }
                        }
                    });
                }
            }
        });
        globalThis.vscObservers.bgExistObserver.observe(parent, {
            childList: true,
        });
    }
}
