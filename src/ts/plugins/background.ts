/**
 * 检测背景图片插件是否在运行
 * @param times 运行次数
 */
export function bg(times: number) {
    // 背景自定义插件，部分情况下插件加载缓慢可重复检测一次
    const bglayer = document.getElementById("bglayer");
    if (bglayer) {
        const style = window.getComputedStyle(bglayer);
        const body = document.body;
        if (style.getPropertyValue("display") !== "none") {
            body.classList.add("bgenable");
        } else if (style.getPropertyValue("display") === "none") {
            // console.log("disable background");
            body.classList.remove("bgenable");
        }
        // 刚开始每2秒重新检测状态，检测10秒
        if (times < 5) {
            globalThis.vscTimer.bgTimer = setTimeout(bg, 2000, times + 1);
        } else {
            globalThis.vscTimer.bgTimer = null;
        }
    } else if (times === 0 || times === 1) {
        // 未启用插件3秒后重新检测两遍
        setTimeout(bg, 3000, times + 1);
    }
}

/**
 * 监听背景图片插件的属性修改
 * @param times 运行次数
 */
export function bgobserver(times: number) {
    const bglayer = document.getElementById("bglayer");
    if (bglayer) {
        globalThis.vscObserver.bgObserver = new MutationObserver(function (mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    // 样式发生变化时执行的代码
                    bg(0);
                }
            }
        });
        globalThis.vscObserver.bgObserver.observe(bglayer, {
            attributes: true, // 监听属性变化
            attributeFilter: ["style"], // 只监听 style 属性
        });
        globalThis.vscTimer.bgObserTimer = null;
    } else {
        // if (times == 0 && !document.body.classList.contains('vscmobile')) {
        if (times == 0) {
            // 运行失败等待5秒
            globalThis.vscTimer.bgObserTimer = setTimeout(bgobserver, 5000, 1);
        } else if (times == 1) {
            console.error("背景插件监听失败，修改插件启用状态需手动刷新");
            globalThis.vscTimer.bgObserTimer = null;
        }
    }
}
