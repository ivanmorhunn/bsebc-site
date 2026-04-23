// ============================================================
//  BSEBC CONTENT FILE — edit this to update all site text
// ============================================================

const CONTENT = {

  site: {
    name:     { ru: "BSEBC", en: "BSEBC" },
    tagline:  { ru: "Славянская Евангельская Баптистская Церковь", en: "Brookhaven Slavic Evangelical Baptist Church" },
    location: { ru: "г. Брукхейвен, Пенсильвания", en: "Brookhaven, Pennsylvania" },
    youtubeChannel: "https://www.youtube.com/channel/UCgAOqEYimhA21nN2zQkOcYQ",
    youtubeLive:    "https://www.youtube.com/channel/UCgAOqEYimhA21nN2zQkOcYQ/live",
    vimeo:          "https://vimeo.com/bsebc",
    soundcloud:     "https://soundcloud.com/bsebc",
    photos:         "http://bsebc.zenfolio.com/f781568629",
    venmo:          "https://www.venmo.com/u/bsebc",
    charter:        "https://drive.google.com/file/d/1Y_Ifss3Tri7w-Wrjmes3FUVg1Pn3xHEi/view?usp=sharing",
    address:        "415 Edwards Dr, Brookhaven, PA 19015",
  },

  nav: {
    home:     { ru: "Главная",      en: "Home" },
    schedule: { ru: "Расписание",   en: "Schedule" },
    archive:  { ru: "Архив",        en: "Archive" },
    about:    { ru: "О нас",        en: "About" },
    homeGallery: { ru: "Фото", en: "Photos" },
    gallery:  { ru: "Галерея",      en: "Gallery" },
    donate:   { ru: "Пожертвовать", en: "Donate" },
    contact:  { ru: "Как нас найти", en: "Find Us" },
    live:     { ru: "Прямой эфир",  en: "Live Stream" },
  },

  galleryPage: {
    title: { ru: "Фото <em>архив</em>", en: "Photo <em>archive</em>" },
    eyebrow: { ru: "Брукхейвен, Пенсильвания", en: "BSEBC · Brookhaven, Pennsylvania" },
    subtitle: {
      ru: "Собрание моментов из жизни церкви — богослужения, праздники, служение и общение.",
      en: "Moments from church life—worship, holidays, service, and fellowship."
    },
    sectionKicker: { ru: "Архив", en: "Archive" },
    sectionTitle: { ru: "Год за <em>годом</em>", en: "Year by <em>year</em>" },
    sectionLead: {
      ru: "Выберите год, затем при необходимости папку — если в этом году в архиве несколько альбомов.",
      en: "Choose a year, then pick a folder when that year has more than one album in the archive."
    },
    folderNavLabel: { ru: "Папка", en: "Folder" },
    folderRoot: { ru: "Основное", en: "Main" },
    back: { ru: "← Вернуться на главную", en: "← Back to home" },
    loading: { ru: "Загрузка фотографий...", en: "Loading photos..." },
    emptyTitle: { ru: "Фото не найдены", en: "No photos found" },
    emptyBody: { ru: "В этом разделе пока нет фотографий.", en: "There are no photos in this section yet." },
    errorTitle: { ru: "Не удалось загрузить фото", en: "Couldn’t load photos" },
    errorBody: {
      ru: "Проверьте, что сайт открыт с того же домена, где работает /api/photos на Vercel, и что заданы переменные CLOUDINARY_*.",
      en: "Open the site on the same origin as your Vercel deployment (so /api/photos works) and verify CLOUDINARY_* env vars are set."
    },
    download: { ru: "Скачать", en: "Download" },
    downloadAria: { ru: "Скачать это фото", en: "Download this photo" },
  },

  hero: {
    heading: { ru: "Добро пожаловать\nв дом Божий",  en: "Welcome to\nthe House of God" },
    verse:   { ru: "Мы проповедуем Христа распятого, воскресшего и вновь грядущего", en: "We preach Christ crucified, risen, and coming again" },
    cta1:    { ru: "Расписание служений", en: "Service Schedule" },
    cta2:    { ru: "Смотреть онлайн",     en: "Watch Live" },
  },

  schedule: {
    label:   { ru: "Расписание служений", en: "Service Schedule" },
    heading: { ru: "Приходите поклониться вместе с нами", en: "Join Us in Worship" },
    days: [
      {
        name: { ru: "Воскресенье", en: "Sunday" },
        services: [
          { time: "10:00 AM", name: { ru: "Утреннее богослужение", en: "Morning Service" } },
          { time: "6:00 PM",  name: { ru: "Вечернее богослужение", en: "Evening Service" } },
        ]
      },
      {
        name: { ru: "Среда", en: "Wednesday" },
        services: [
          { time: "7:00 PM", name: { ru: "Разбор Слова Божия", en: "Bible Study" } },
          { time: "7:30 PM", name: { ru: "Воскресная школа",   en: "Sunday School" } },
        ]
      },
      {
        name: { ru: "Пятница", en: "Friday" },
        services: [
          { time: "6:00 AM", name: { ru: "Братская молитва",    en: "Men's Prayer" } },
          { time: "7:00 PM", name: { ru: "Русская школа",        en: "Russian School" } },
          { time: "9:00 PM", name: { ru: "Молодёжное общение",   en: "Youth Fellowship" } },
        ]
      }
    ]
  },

  // FIX #6 — verse is now larger in styles, text unchanged
  verseBanner: {
    text: {
      ru: "Мы проповедуем Христа распятого, воскресшего и вновь грядущего",
      en: "We preach Christ crucified, risen, and coming again"
    },
    ref: { ru: "Девиз церкви BSEBC", en: "The mission of BSEBC" }
  },

  archive: {
    label:   { ru: "Медиа архив", en: "Media Archive" },
    heading: { ru: "Записи служений", en: "Service Recordings" },
    items: [
      { title: { ru: "Аудио архив",   en: "Audio Archive" },   sub: { ru: "Служения, проповеди, песни", en: "Services, sermons, songs" },   url: "https://soundcloud.com/bsebc/sets",                         icon: "audio"   },
      { title: { ru: "Проповеди",     en: "Sermons" },          sub: { ru: "Разбор Слова Божия",          en: "Bible studies" },               url: "https://soundcloud.com/bsebc/albums",                       icon: "book"    },
      { title: { ru: "YouTube архив", en: "YouTube Archive" },  sub: { ru: "Видеозаписи служений",        en: "Video recordings" },            url: "https://www.youtube.com/channel/UCgAOqEYimhA21nN2zQkOcYQ/videos", icon: "youtube" },
      { title: { ru: "Vimeo архив",   en: "Vimeo Archive" },    sub: { ru: "Дополнительные записи",       en: "Additional recordings" },       url: "https://vimeo.com/bsebc",                                  icon: "video"   },
      { title: { ru: "Хоровое пение", en: "Choir" },            sub: { ru: "Записи хора",                 en: "Choir recordings" },            url: "https://soundcloud.com/bsebc/sets/vywqy64m3exb",            icon: "choir"   },
      { title: { ru: "Фотогалерея",   en: "Photo Gallery" },    sub: { ru: "Zenfolio — архив фото",       en: "Zenfolio — photo archive" },    url: "http://bsebc.zenfolio.com/f781568629",                      icon: "photo"   },
    ]
  },

  about: {
    label:   { ru: "О нас", en: "About Us" },
    heading: { ru: "Церковь, основанная\nна Слове Божием", en: "A Church Built\non the Word of God" },
    body: {
      ru: "Мы — Славянская Евангельская Баптистская Церковь в Брукхейвене, Пенсильвания. Наши двери открыты для всех, кто ищет Бога, живое общение и духовную семью. Мы верим в силу молитвы, Слова Божия и братского единства.",
      en: "We are the Brookhaven Slavic Evangelical Baptist Church of Brookhaven, Pennsylvania. Our doors are open to all who seek God, living fellowship, and a spiritual family. We believe in the power of prayer, the Word of God, and brotherly unity."
    },
    charterLabel: { ru: "Читать устав церкви", en: "Read Church Charter" },
    beliefs: {
      heading: { ru: "Во что мы верим", en: "What We Believe" },
      items: [
        { ru: "Библия — богодухновенное и непогрешимое Слово Божие",  en: "The Bible is the inspired and infallible Word of God" },
        { ru: "Христос — единственный Спаситель и Господь",           en: "Christ is the only Savior and Lord" },
        { ru: "Спасение только по вере в Иисуса Христа",              en: "Salvation is by faith in Jesus Christ alone" },
        { ru: "Церковь — тело Христово, собрание верующих",           en: "The Church is the body of Christ, a gathering of believers" },
        { ru: "Воскресение Христа и Его второе пришествие",           en: "The resurrection of Christ and His second coming" },
      ]
    }
  },

  // FIX #4 — donation verse changed to 2 Corinthians 9:7 (giving-related)
  donate: {
    label:   { ru: "Пожертвования", en: "Giving" },
    heading: { ru: "Поддержите служение церкви", en: "Support the Church's Ministry" },
    body: {
      ru: "Ваши пожертвования помогают нам распространять Слово Божие, служить ближним и поддерживать церковное служение в нашем городе и по всему миру.",
      en: "Your gifts help us spread the Word of God, serve our neighbors, and support the church's ministry in our city and around the world."
    },
    cta: { ru: "Пожертвовать через Venmo", en: "Give via Venmo" },
    // FIX #4 — 2 Corinthians 9:7 — about cheerful giving
    sideVerse: {
      ru: "Каждый уделяй по расположению сердца, не с огорчением и не с принуждением; ибо доброхотно дающего любит Бог.",
      en: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
    },
    sideVerseRef: { ru: "2 Коринфянам 9:7", en: "2 Corinthians 9:7" },
  },

  contact: {
    label:   { ru: "Контакты", en: "Contact" },
    heading: { ru: "Как нас найти", en: "Find Us" },
    address: { ru: "415 Edwards Dr, Brookhaven, PA 19015", en: "415 Edwards Dr, Brookhaven, PA 19015" },
    emailPlaceholder: {
      name:    { ru: "Ваше имя",        en: "Your name" },
      email:   { ru: "Ваш email",       en: "Your email" },
      message: { ru: "Ваше сообщение",  en: "Your message" },
      send:    { ru: "Отправить",       en: "Send" },
    }
  },

  // FIX #5 — rewritten footer tagline
  footer: {
    tagline: {
      ru: "Служим Богу и людям с любовью — в Брукхейвене и за его пределами.",
      en: "Serving God and people with love — in Brookhaven and beyond."
    },
    copyright: { ru: "Все права защищены", en: "All rights reserved" },
    cols: {
      nav:     { ru: "Навигация", en: "Navigation" },
      archive: { ru: "Архив",     en: "Archive" },
      connect: { ru: "Связь",     en: "Connect" },
    }
  }
};
