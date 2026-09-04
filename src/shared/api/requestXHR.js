export function RequestXHR({
                               method,
                               url,
                               json = null,
                               formData = null,
                               onSuccess = () => {},
                               onError = () => {},
                               onProgress = () => {},
                               onStart = () => {},
                               controller = null,
                               showModal = () => {},
                           }) {
    const request = new XMLHttpRequest();
    request.open(method, 'https://altaizakaz.ru' + url, true);

    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Access-Control-Allow-Origin", "*");

    if (json !== null) {
        request.setRequestHeader("Content-Type", "application/json");
    }

    request.withCredentials = true;

    request.onload = function () {
        try {
            const responseObj = JSON.parse(request.response || '{}')

            if (request.status >= 400) {
                showModal({
                    type: 'error',
                    title: "Ошибка запроса",
                    message: responseObj.message || `Ошибка ${request.status}`
                })
                onError(responseObj)
            } else {
                onSuccess(responseObj)
            }
        } catch (err) {
            showModal({
                type: 'error',
                title: 'Ошибка обработки данных',
                message: 'Неверный формат ответа от сервера'
            })
            onError(err)
        }
    }

    request.upload.onloadstart = onStart;
    request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(percent)
        }
    }

    request.onerror = function () {
        showModal({
            type: 'error',
            title: 'Ошибка сети',
            message: 'Не удалось отправить запрос. Проверьте соединение.'
        })
        onError(request)
    }

    const abortRequest = () => request.abort();
    if (controller) controller.signal.addEventListener('abort', abortRequest);

    if (json) request.send(JSON.stringify(json));
    else if (formData) request.send(formData);
    else request.send()

    return abortRequest

}