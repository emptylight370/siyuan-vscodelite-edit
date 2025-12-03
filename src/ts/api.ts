/**
 * NOTE 定义需要用到的api
 * 从[Savor](https://github.com/royc01/notion-theme/blob/main/theme.js)抄的
 * 来自[思源api文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
 * 参考[社区api文档](https://www.siyuan-note.club/apis)
 * TODO 完成所需的所有api写入
 */

/**
 * 向思源请求数据
 * @param url 请求url
 * @param data 请求数据(json encode)
 * @returns Promise&lt;any&gt;?
 * @since 1.2.0
 * @version 2.3.0
 */
export async function _rqFORSiyuan(url: string, data: any) {
    try {
        const response = await fetch(url, {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                Authorization: `Token ${window.siyuan?.config?.api?.token ?? ""}`,
            },
        });
        // 为_getFile()特别准备一个返回值用于显示错误详情
        if (response.status === 202) return await response.json();
        // 如果返回为ok则响应结果，否则返回null
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.log("VSCode Lite Edit api error:", error);
        return null;
    }
}

/**
 * 获取文件
 * @param path 文件路径
 * @param then then?
 * @param obj obj?
 * @returns 文件内容
 * @since 1.2.0
 * @version 2.3.0
 */
export async function _getFile(path: string) {
    const result = await _rqFORSiyuan("/api/file/getFile", {
        path: path,
    });
    // 未获取到结果
    if (!result) {
        console.error(`VSCE: Read file ${path} failed.`);
        return null;
    }
    // 思源返回错误码
    if (result.code === 403) {
        console.error(`VSCE(${result.code}): Read file ${path} forbidden, not in workspace.`);
        return null;
    } else if (result.code === 404) {
        console.error(`VSCE(${result.code}): Read file ${path} failed, file not found.`);
        return null;
    } else if (result.code === 405) {
        console.error(`VSCE(${result.code}): Read file ${path} failed, this is a directory.`);
        return null;
    } else if (result.code === 500) {
        console.error(`VSCE(${result.code}): Read file ${path} failed, SiYuan internal error occured.`);
        return null;
    }
    // 正常返回结果
    return result;
}

/**
 * 写入文件
 * @param path 文件路径
 * @param filedata 文件数据
 * @param then then?
 * @param obj obj?
 * @param isDir 是否是路径
 * @param modTime 修改时间
 * @returns Promise&lt;void&gt;
 * @since 1.2.0
 * @version 2.3.0
 */
export async function _writeFile(path: string, filedata: any, isDir = false, modTime = Date.now()) {
    let blob = new Blob([filedata]);
    let file = new File([blob], path.split("/").pop());

    let formdata = new FormData();
    formdata.append("path", path);
    formdata.append("file", file);
    formdata.append("isDir", isDir.toString());
    formdata.append("modTime", modTime.toString());

    try {
        await fetch("/api/file/putFile", {
            body: formdata,
            method: "POST",
            headers: {
                Authorization: `Token ${window.siyuan?.config?.api?.token ?? ""}`,
            },
        });
    } catch (error) {
        console.error("VSCE: Write file error:", error);
    }
}

/**
 * 发送消息
 * @param type 消息类型 - "ok" | "error"
 * @param message 消息内容
 * @param time 持续时间 - "number" | "null"
 * @returns Promise&lt;void&gt;
 * @since 1.2.2
 * @version 2.4.2
 */
export async function _postMessage(type: "ok" | "error", message: string, time = null) {
    let url: string;
    switch (type) {
        case "ok":
            url = "/api/notification/pushMsg";
            break;
        case "error":
            url = "api/notification/pushErrMsg";
            break;
        default:
            return;
    }
    if (time) await _rqFORSiyuan(url, { msg: message, timeout: time });
    else await _rqFORSiyuan(url, { msg: message });
}

/**
 * 重新加载页面
 * @returns Promise&lt;void&gt;
 * @since 2.3.9
 * @version 2.4.2
 */
export async function _reloadInterface() {
    const url = "/api/ui/reloadUI";
    _rqFORSiyuan(url, undefined);
}
