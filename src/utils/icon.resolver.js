import { linkOutline, callOutline, mailOutline, chatbubbleOutline, locationOutline, barcodeOutline } from 'ionicons/icons'

const ICON_MAP = { URL: linkOutline, PHONE: callOutline, EMAIL: mailOutline, SMS: chatbubbleOutline, GEO: locationOutline }

export const resolveIconForValueType = (type) => ICON_MAP[type] || barcodeOutline
