/**
 * NOTE 定义需要用到的api
 * 从[Savor](https://github.com/royc01/notion-theme/blob/main/theme.js)抄的
 * 来自[思源api文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
 * TODO 完成所需的所有api写入
 */

/**
 * 向思源请求数据
 * @param url 请求url
 * @param data 请求数据(json encode)
 * @returns Promise\<any\>?
 */
export async function _rqFORSiyuan(url: string, data: any) {
    const response = await fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token ''`
        }
    });
    if (response.status === 200)
        return await response.json();
    else
        return null;
}

/**
 * 获取文件
 * @param path 文件路径
 * @param then then?
 * @param obj obj?
 * @returns 文件内容
 */
export async function _getFile(path: string, then = null, obj = null) {
    let url = '/api/file/getFile';
    await _rqFORSiyuan(url, {
        path: path
    }).then((v) => {
        if (then)
            then(v, obj);
    });
}

/**
 * 写入文件
 * @param path 文件路径
 * @param filedata 文件数据
 * @param then then?
 * @param obj obj?
 * @param isDir 是否是路径
 * @param modTime 修改时间
 * @returns Promise\<void\>
*/
export async function _writeFile(path: string, filedata: any, then = null, obj = null, isDir = false, modTime = Date.now()) {
    let blob = new Blob([filedata]);
    let file = new File([blob], path.split('/').pop());
    let formdata = new FormData();
    formdata.append("path", path);
    formdata.append("file", file);
    formdata.append("isDir", isDir.toString());
    formdata.append("modTime", modTime.toString());
    await fetch("/api/file/putFile", {
        body: formdata,
        method: 'POST',
        headers: {
            Authorization: `Token ""`
        }
    }).then((v) => {
        if (then)
            then(obj);
        return v;
    });
}

/**
 * 发送消息
 * @param type 消息类型 - "ok" or "error"
 * @param message 消息内容
 * @param time 持续时间
 * @returns Promise\<void\>
 */
export async function _postMessage(type: "ok" | "error", message: string, time = null) {
    if (type == "ok")
        var url = "/api/notification/pushMsg";
    else if (type == "error")
        url = "api/notification/pushErrMsg";
    if (time)
        await _rqFORSiyuan(url, { "msg": message, "timeout": time });
    else
        await _rqFORSiyuan(url, { "msg": message });
}