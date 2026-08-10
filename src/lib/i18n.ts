// ============================================
// DREAMERP — Internationalization (UZ / RU)
// ============================================

import type { Language } from './types';

const translations = {
  // --- Common ---
  'app.name': { uz: 'DREAMERP', ru: 'DREAMERP' },
  'app.subtitle': { uz: 'Ishlab Chiqarish ERP', ru: 'Производственная ERP' },
  'common.search': { uz: 'Qidirish...', ru: 'Поиск...' },
  'common.save': { uz: 'Saqlash', ru: 'Сохранить' },
  'common.cancel': { uz: 'Bekor qilish', ru: 'Отмена' },
  'common.delete': { uz: "O'chirish", ru: 'Удалить' },
  'common.edit': { uz: 'Tahrirlash', ru: 'Редактировать' },
  'common.add': { uz: "Qo'shish", ru: 'Добавить' },
  'common.close': { uz: 'Yopish', ru: 'Закрыть' },
  'common.filter': { uz: 'Filtr', ru: 'Фильтр' },
  'common.export': { uz: 'Eksport', ru: 'Экспорт' },
  'common.print': { uz: 'Chop etish', ru: 'Печать' },
  'common.actions': { uz: 'Amallar', ru: 'Действия' },
  'common.status': { uz: 'Status', ru: 'Статус' },
  'common.date': { uz: 'Sana', ru: 'Дата' },
  'common.total': { uz: 'Jami', ru: 'Итого' },
  'common.quantity': { uz: 'Miqdor', ru: 'Количество' },
  'common.price': { uz: 'Narx', ru: 'Цена' },
  'common.name': { uz: 'Nomi', ru: 'Название' },
  'common.phone': { uz: 'Telefon', ru: 'Телефон' },
  'common.all': { uz: 'Barchasi', ru: 'Все' },
  'common.yes': { uz: 'Ha', ru: 'Да' },
  'common.no': { uz: "Yo'q", ru: 'Нет' },
  'common.loading': { uz: 'Yuklanmoqda...', ru: 'Загрузка...' },
  'common.no_data': { uz: "Ma'lumot topilmadi", ru: 'Данные не найдены' },
  'common.showing': { uz: 'Ko\'rsatilmoqda', ru: 'Показано' },
  'common.of': { uz: 'dan', ru: 'из' },
  'common.prev': { uz: 'Oldingi', ru: 'Назад' },
  'common.next': { uz: 'Keyingi', ru: 'Далее' },

  // --- Auth ---
  'auth.login': { uz: 'Kirish', ru: 'Войти' },
  'auth.logout': { uz: 'Chiqish', ru: 'Выйти' },
  'auth.select_role': { uz: 'Rolni tanlang', ru: 'Выберите роль' },
  'auth.welcome': { uz: 'Xush kelibsiz!', ru: 'Добро пожаловать!' },

  // --- Navigation ---
  'nav.dashboard': { uz: 'Boshqaruv paneli', ru: 'Панель управления' },
  'nav.crm': { uz: 'CRM va Buyurtmalar', ru: 'CRM и Заказы' },
  'nav.clients': { uz: 'Mijozlar', ru: 'Клиенты' },
  'nav.production': { uz: 'Ishlab chiqarish', ru: 'Производство' },
  'nav.inventory': { uz: 'Ombor', ru: 'Склад' },
  'nav.bom': { uz: 'BOM / Retseptlar', ru: 'BOM / Рецепты' },
  'nav.finance': { uz: 'Moliya', ru: 'Финансы' },
  'nav.staff': { uz: 'Xodimlar', ru: 'Сотрудники' },
  'nav.suppliers': { uz: "Ta'minotchilar", ru: 'Поставщики' },
  'nav.settings': { uz: 'Sozlamalar', ru: 'Настройки' },
  'nav.support': { uz: 'Yordam', ru: 'Поддержка' },

  // --- Dashboard ---
  'dashboard.title': { uz: 'Umumiy ko\'rinish', ru: 'Обзор' },
  'dashboard.subtitle': { uz: "Bugungi ishlab chiqarish ko'rsatkichlari va moliyaviy xulosa.", ru: 'Сводка производственных показателей и финансов за сегодня.' },
  'dashboard.daily_sales': { uz: 'Kunlik savdo', ru: 'Дневные продажи' },
  'dashboard.active_orders': { uz: 'Faol buyurtmalar', ru: 'Активные заказы' },
  'dashboard.in_production': { uz: 'Ishlab chiqarishda', ru: 'В производстве' },
  'dashboard.cash_balance': { uz: 'Kassa qoldig\'i', ru: 'Остаток кассы' },
  'dashboard.current_balance': { uz: 'Joriy qoldiq', ru: 'Текущий остаток' },
  'dashboard.low_stock': { uz: 'Kam qolgan xomashyo', ru: 'Низкий запас' },
  'dashboard.requires_restock': { uz: 'Zudlik bilan to\'ldirish kerak', ru: 'Требуется пополнение' },
  'dashboard.vs_yesterday': { uz: 'kechagiga nisbatan', ru: 'по сравнению со вчера' },
  'dashboard.sales_performance': { uz: 'Savdo ko\'rsatkichlari', ru: 'Показатели продаж' },
  'dashboard.top_products': { uz: 'Top mahsulotlar', ru: 'Топ продукты' },
  'dashboard.recent_orders': { uz: 'So\'nggi buyurtmalar', ru: 'Последние заказы' },
  'dashboard.last_7_days': { uz: 'So\'nggi 7 kun', ru: 'Последние 7 дней' },
  'dashboard.new_order': { uz: '+ Yangi buyurtma', ru: '+ Новый заказ' },
  'dashboard.report': { uz: 'Hisobot', ru: 'Отчёт' },

  // --- Orders ---
  'orders.title': { uz: 'CRM va Buyurtmalar', ru: 'CRM и Заказы' },
  'orders.subtitle': { uz: 'Mijoz buyurtmalarini boshqarish va ishlab chiqarish jarayonini kuzatish.', ru: 'Управление заказами клиентов и отслеживание производства.' },
  'orders.new': { uz: 'Yangi buyurtma', ru: 'Новый заказ' },
  'orders.create': { uz: 'Buyurtma yaratish', ru: 'Создать заказ' },
  'orders.create_subtitle': { uz: 'Yangi ishlab chiqarish buyurtmasini boshlash uchun ma\'lumotlarni kiriting.', ru: 'Введите данные для начала нового производственного заказа.' },
  'orders.order_id': { uz: 'Buyurtma ID', ru: 'ID заказа' },
  'orders.client_name': { uz: 'Mijoz nomi', ru: 'Имя клиента' },
  'orders.product': { uz: 'Mahsulot', ru: 'Продукт' },
  'orders.total_price': { uz: 'Umumiy narx (UZS)', ru: 'Общая стоимость (UZS)' },
  'orders.payment': { uz: "To'lov", ru: 'Оплата' },
  'orders.send_to_production': { uz: 'Buyurtma yaratish va ishlab chiqarishga yuborish', ru: 'Создать заказ и отправить в производство' },
  'orders.back': { uz: 'Buyurtmalarga qaytish', ru: 'Вернуться к заказам' },

  // --- Client Details ---
  'client.details': { uz: 'Mijoz ma\'lumotlari', ru: 'Данные клиента' },
  'client.select': { uz: 'Mavjud mijozni tanlang', ru: 'Выберите существующего клиента' },
  'client.search': { uz: 'Mijoz qidirish...', ru: 'Поиск клиента...' },
  'client.add_new': { uz: 'Yangi mijoz qo\'shish', ru: 'Добавить нового клиента' },
  'client.balance': { uz: 'Joriy balans', ru: 'Текущий баланс' },
  'client.balance_warning': { uz: 'Mijoz balansida qarz mavjud!', ru: 'У клиента имеется задолженность!' },

  // --- Product ---
  'product.info': { uz: 'Mahsulot va Buyurtma ma\'lumotlari', ru: 'Информация о продукте и заказе' },
  'product.select': { uz: 'Mahsulotni tanlang...', ru: 'Выберите продукт...' },
  'product.unit_price': { uz: 'Birlik narxi', ru: 'Цена за единицу' },
  'product.total_order_price': { uz: 'Buyurtma umumiy narxi', ru: 'Общая стоимость заказа' },

  // --- Design Assets ---
  'design.title': { uz: 'Dizayn fayllar', ru: 'Дизайн файлы' },
  'design.upload': { uz: 'Rasm yoki PDF yuklang', ru: 'Загрузите фото или PDF' },
  'design.drag_drop': { uz: 'Fayllarni shu yerga tashlang yoki bosing', ru: 'Перетащите файлы сюда или нажмите' },
  'design.cloud_link': { uz: 'Bulutli xotira havolasi', ru: 'Ссылка на облачное хранилище' },
  'design.max_size': { uz: 'Har bir fayl uchun max 500MB', ru: 'Максимум 500MB на файл' },

  // --- Payment ---
  'payment.title': { uz: "To'lov ma'lumotlari", ru: 'Информация об оплате' },
  'payment.method': { uz: "To'lov usuli", ru: 'Способ оплаты' },
  'payment.cash': { uz: 'Naqd pul', ru: 'Наличные' },
  'payment.card': { uz: 'Plastik karta', ru: 'Банковская карта' },
  'payment.transfer': { uz: "Pul ko'chirish", ru: 'Перевод' },
  'payment.advance': { uz: 'Avans summasi (UZS)', ru: 'Сумма аванса (UZS)' },
  'payment.remaining': { uz: 'Qoldiq summa', ru: 'Остаток' },

  // --- Inventory ---
  'inventory.title': { uz: 'Ombor boshqaruvi', ru: 'Управление складом' },
  'inventory.subtitle': { uz: 'Xomashyolarni kuzatish va zaxira darajasini boshqarish.', ru: 'Отслеживание сырья и управление уровнем запасов.' },
  'inventory.raw_materials': { uz: 'Xomashyolar', ru: 'Сырьё' },
  'inventory.finished_products': { uz: 'Tayyor mahsulotlar', ru: 'Готовая продукция' },
  'inventory.logs': { uz: 'Kirim-chiqim tarixi', ru: 'История движения' },
  'inventory.add_stock': { uz: 'Kirim qilish', ru: 'Оприходовать' },
  'inventory.add_item': { uz: 'Yangi maxsulot qo\'shish', ru: 'Добавить новый товар' },
  'inventory.report_scrap': { uz: 'Brak hisoboti', ru: 'Отчёт о браке' },
  'inventory.material_name': { uz: 'Material nomi', ru: 'Название материала' },
  'inventory.category': { uz: 'Kategoriya', ru: 'Категория' },
  'inventory.unit': { uz: 'Birlik', ru: 'Единица' },
  'inventory.current_stock': { uz: 'Joriy zaxira', ru: 'Текущий запас' },
  'inventory.min_level': { uz: 'Minimal daraja', ru: 'Минимальный уровень' },

  // --- BOM ---
  'bom.title': { uz: 'BOM / Retseptlar', ru: 'BOM / Рецепты' },
  'bom.subtitle': { uz: 'Tayyor mahsulotlar uchun texnologik xaritalar.', ru: 'Технологические карты для готовой продукции.' },
  'bom.finished_products': { uz: 'Tayyor mahsulotlar', ru: 'Готовая продукция' },
  'bom.filter_products': { uz: 'Mahsulotlarni filtrlash...', ru: 'Фильтровать продукты...' },
  'bom.materials_for': { uz: '1 birlik ishlab chiqarish uchun BOM', ru: 'BOM для производства 1 единицы' },
  'bom.material_name': { uz: 'Material nomi', ru: 'Название материала' },
  'bom.quantity_needed': { uz: 'Miqdor', ru: 'Количество' },
  'bom.estimated_cost': { uz: 'Taxminiy narx', ru: 'Примерная стоимость' },
  'bom.total_cost': { uz: '1 birlik uchun jami xomashyo narxi', ru: 'Общая стоимость сырья на 1 единицу' },
  'bom.add_material': { uz: 'Retseptga material qo\'shish', ru: 'Добавить материал в рецепт' },
  'bom.search_material': { uz: 'Xomashyo qidirish...', ru: 'Поиск сырья...' },
  'bom.save_recipe': { uz: 'Retseptni saqlash', ru: 'Сохранить рецепт' },
  'bom.version_history': { uz: 'Versiyalar tarixi', ru: 'История версий' },

  // --- Production ---
  'production.title': { uz: 'Ishlab chiqarish', ru: 'Производство' },
  'production.subtitle': { uz: 'Buyurtmalarning ishlab chiqarish bosqichlarini kuzatish.', ru: 'Отслеживание этапов производства заказов.' },
  'production.printing': { uz: 'Chop etish', ru: 'Печать' },
  'production.cutting': { uz: 'Kesish', ru: 'Резка' },
  'production.gluing': { uz: 'Yelimlash', ru: 'Склейка' },
  'production.packing': { uz: 'Qadoqlash', ru: 'Упаковка' },

  // --- Finance ---
  'finance.title': { uz: 'Moliya va Kassa', ru: 'Финансы и Касса' },
  'finance.subtitle': { uz: 'Kirim-chiqim, kassa qoldig\'i va moliyaviy hisobotlar.', ru: 'Приход-расход, остаток кассы и финансовые отчёты.' },
  'finance.cash_register': { uz: 'Kassa', ru: 'Касса' },
  'finance.transactions': { uz: 'Tranzaksiyalar', ru: 'Транзакции' },
  'finance.income': { uz: 'Kirim', ru: 'Приход' },
  'finance.expense': { uz: 'Chiqim', ru: 'Расход' },
  'finance.refund': { uz: 'Qaytarish', ru: 'Возврат' },
  'finance.profit_loss': { uz: 'Foyda-zarar', ru: 'Прибыль-убыток' },
  'finance.new_transaction': { uz: 'Yangi tranzaksiya', ru: 'Новая транзакция' },

  // --- Staff ---
  'staff.title': { uz: 'Xodimlar va KPI', ru: 'Сотрудники и KPI' },
  'staff.subtitle': { uz: 'Xodimlar ro\'yxati, ishbay hisoblash va oylik hisobot.', ru: 'Список сотрудников, расчёт сдельной оплаты и ежемесячный отчёт.' },
  'staff.base_salary': { uz: 'Bazaviy oylik', ru: 'Базовая зарплата' },
  'staff.kpi_total': { uz: 'KPI yig\'indisi', ru: 'Сумма KPI' },
  'staff.completed_tasks': { uz: 'Bajarilgan vazifalar', ru: 'Выполненные задачи' },

  // --- Suppliers ---
  'suppliers.title': { uz: "Ta'minotchilar", ru: 'Поставщики' },
  'suppliers.subtitle': { uz: "Xomashyo ta'minotchilarini boshqarish.", ru: 'Управление поставщиками сырья.' },
  'suppliers.add_new': { uz: "Yangi ta'minotchi", ru: 'Новый поставщик' },
  'suppliers.last_delivery': { uz: 'Oxirgi yetkazma', ru: 'Последняя поставка' },

  // --- Settings ---
  'settings.title': { uz: 'Sozlamalar', ru: 'Настройки' },
  'settings.language': { uz: 'Til', ru: 'Язык' },
  'settings.profile': { uz: 'Profil', ru: 'Профиль' },
  'settings.notifications': { uz: 'Bildirishnomalar', ru: 'Уведомления' },
  'settings.telegram': { uz: 'Telegram bot', ru: 'Telegram бот' },

  // --- Roles ---
  'role.admin': { uz: 'Admin / Rahbar', ru: 'Админ / Руководитель' },
  'role.seller': { uz: 'Sotuvchi (CRM)', ru: 'Продавец (CRM)' },
  'role.warehouse': { uz: 'Omborchi', ru: 'Кладовщик' },
  'role.worker': { uz: 'Ishlab chiqaruvchi / Usta', ru: 'Производственник / Мастер' },

  // --- Statuses ---
  'status.pending': { uz: 'Kutilyapti', ru: 'Ожидание' },
  'status.printing': { uz: 'Chop etish', ru: 'Печать' },
  'status.cutting': { uz: 'Kesish', ru: 'Резка' },
  'status.gluing': { uz: 'Yelimlash', ru: 'Склейка' },
  'status.packing': { uz: 'Qadoqlash', ru: 'Упаковка' },
  'status.ready': { uz: 'Tayyor', ru: 'Готово' },
  'status.delivered': { uz: 'Topshirildi', ru: 'Доставлено' },
  'status.returned': { uz: 'Qaytarildi', ru: 'Возвращено' },

  // --- Units ---
  'unit.dona': { uz: 'Dona', ru: 'Шт' },
  'unit.metr': { uz: 'Metr', ru: 'Метр' },
  'unit.sm': { uz: 'SM', ru: 'СМ' },
  'unit.litr': { uz: 'Litr', ru: 'Литр' },
  'unit.gramm': { uz: 'Gramm', ru: 'Грамм' },
  'unit.list': { uz: 'List', ru: 'Лист' },
  'unit.karobka': { uz: 'Karobka', ru: 'Коробка' },
  'unit.rulon': { uz: 'Rulon', ru: 'Рулон' },
} as const;

type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry['uz'] || key;
}

export function getTranslations(lang: Language): Record<TranslationKey, string> {
  const result = {} as Record<TranslationKey, string>;
  for (const key of Object.keys(translations) as TranslationKey[]) {
    result[key] = t(key, lang);
  }
  return result;
}

export default translations;
