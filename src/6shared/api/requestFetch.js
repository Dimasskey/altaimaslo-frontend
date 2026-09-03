const API_BASE = import.meta.env.VITE_API_URL || ''
export async function RequestFetch({
    url,
    method = 'GET',
    body = null,
    headers = {},
    onSuccess = () => {},
    onError = () => {},
    retries = 1,
                                   }) {
    try {
        const config = {
            method,
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...headers,
            },
            credentials: 'include',

        }

        if (body) {
            config.body = JSON.stringify(body)
            config.headers['Content-Type'] = 'application/json'
        }


        // const fullUrl = url.startsWith('/api/') ? `${API_BASE}${url}` : url;
        //
        // const response = await fetch(fullUrl, config)
        const response = await fetch('https://altaizakaz.ru'+url, config)
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
            onError(data);
            return {
                success: false,
                data
            }
        }

        onSuccess(data)

        return {success: true, data}
    } catch (err) {
        if (retries > 0) {
            console.warn(`Повтор запроса ${url}... (${retries} попыток осталось)`)
            return RequestFetch({
                url,
                method,
                body,
                headers,
                onSuccess,
                onError,
                retries: retries - 1,
            })
        }

        const errorData = {
            message: err.message || 'Не удалось выполнить запрос',
            title: 'Ошибка сети',
        }

        onError(errorData)

        return {success: false, data: errorData}
    }
}