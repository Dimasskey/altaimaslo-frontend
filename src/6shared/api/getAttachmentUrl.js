import {API_URL} from "@shared/constants/constatns";

export function getAttachmentUrl(guid, is_good) {
    if (!guid) return null;
    return `${API_URL}/api/attachments/${guid}${is_good ? '?is_good=true' : ''}`
}