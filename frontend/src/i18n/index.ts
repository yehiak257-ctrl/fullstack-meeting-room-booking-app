import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      appName: 'RoomBook',
      nav: {
        rooms: 'Rooms',
        myBookings: 'My Bookings',
        profile: 'Profile',
        admin: 'Admin',
        login: 'Log in',
        register: 'Sign up',
        logout: 'Log out',
      },
      rooms: {
        title: 'Meeting Rooms',
        subtitle: 'Discover and reserve the perfect space for your next meeting',
        searchPlaceholder: 'Search by name or location…',
        capacity: 'Capacity',
        location: 'Location',
        bookNow: 'Book now',
        viewDetails: 'View details',
        noRooms: 'No rooms found',
        noRoomsHint: 'Try adjusting your filters or search terms.',
        people: 'people',
        available: 'Available',
        unavailable: 'Unavailable',
      },
      bookings: {
        title: 'My Bookings',
        create: 'New Booking',
        status: {
          pending: 'Pending',
          confirmed: 'Confirmed',
          cancelled: 'Cancelled',
          completed: 'Completed',
        },
        cancel: 'Cancel booking',
        noBookings: 'No bookings yet',
        noBookingsHint: 'Browse rooms and make your first reservation.',
      },
      auth: {
        loginTitle: 'Welcome back',
        loginSubtitle: 'Sign in to manage your room bookings',
        registerTitle: 'Create an account',
        registerSubtitle: 'Start booking meeting rooms in minutes',
        email: 'Email',
        password: 'Password',
        name: 'Full name',
        confirmPassword: 'Confirm password',
        login: 'Sign in',
        register: 'Create account',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        demoHint: 'Demo: alex@example.com / password or admin@example.com / password',
      },
      common: {
        loading: 'Loading…',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        filter: 'Filter',
        actions: 'Actions',
        confirm: 'Confirm',
        back: 'Back',
        error: 'Something went wrong',
        retry: 'Try again',
        theme: 'Theme',
        language: 'Language',
      },
      admin: {
        dashboard: 'Dashboard',
        rooms: 'Rooms',
        bookings: 'Bookings',
        users: 'Users',
        overview: 'Overview',
        totalRooms: 'Total Rooms',
        totalBookings: 'Total Bookings',
        pending: 'Pending',
        confirmed: 'Confirmed',
      },
    },
  },
  ar: {
    translation: {
      appName: 'روم بوك',
      nav: {
        rooms: 'القاعات',
        myBookings: 'حجوزاتي',
        profile: 'الملف الشخصي',
        admin: 'الإدارة',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        logout: 'تسجيل الخروج',
      },
      rooms: {
        title: 'قاعات الاجتماعات',
        subtitle: 'اكتشف واحجز المساحة المثالية لاجتماعك القادم',
        searchPlaceholder: 'ابحث بالاسم أو الموقع…',
        capacity: 'السعة',
        location: 'الموقع',
        bookNow: 'احجز الآن',
        viewDetails: 'عرض التفاصيل',
        noRooms: 'لا توجد قاعات',
        noRoomsHint: 'جرّب تعديل عوامل التصفية أو كلمات البحث.',
        people: 'أشخاص',
        available: 'متاح',
        unavailable: 'غير متاح',
      },
      bookings: {
        title: 'حجوزاتي',
        create: 'حجز جديد',
        status: {
          pending: 'قيد الانتظار',
          confirmed: 'مؤكد',
          cancelled: 'ملغى',
          completed: 'مكتمل',
        },
        cancel: 'إلغاء الحجز',
        noBookings: 'لا توجد حجوزات بعد',
        noBookingsHint: 'تصفح القاعات وقم بأول حجز لك.',
      },
      auth: {
        loginTitle: 'مرحباً بعودتك',
        loginSubtitle: 'سجّل الدخول لإدارة حجوزات القاعات',
        registerTitle: 'إنشاء حساب',
        registerSubtitle: 'ابدأ بحجز قاعات الاجتماعات في دقائق',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        name: 'الاسم الكامل',
        confirmPassword: 'تأكيد كلمة المرور',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        noAccount: 'ليس لديك حساب؟',
        hasAccount: 'لديك حساب بالفعل؟',
        demoHint: 'تجريبي: alex@example.com / password أو admin@example.com / password',
      },
      common: {
        loading: 'جاري التحميل…',
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        search: 'بحث',
        filter: 'تصفية',
        actions: 'إجراءات',
        confirm: 'تأكيد',
        back: 'رجوع',
        error: 'حدث خطأ ما',
        retry: 'إعادة المحاولة',
        theme: 'المظهر',
        language: 'اللغة',
      },
      admin: {
        dashboard: 'لوحة التحكم',
        rooms: 'القاعات',
        bookings: 'الحجوزات',
        users: 'المستخدمون',
        overview: 'نظرة عامة',
        totalRooms: 'إجمالي القاعات',
        totalBookings: 'إجمالي الحجوزات',
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
      },
    },
  },
}

const savedLang = localStorage.getItem('room_booking_lang') || 'en'

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n

export function setLanguage(lang: 'en' | 'ar') {
  i18n.changeLanguage(lang)
  localStorage.setItem('room_booking_lang', lang)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
}

// Apply initial direction
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = savedLang
