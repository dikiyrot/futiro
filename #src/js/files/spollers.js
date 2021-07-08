const spollersArray = document.querySelectorAll('[data-spollers]');

if (spollersArray.length > 0) {
   //получение обычных споллеров
   // const spollersRegular = Array.from(spollersArray).filter(item => !item.dataset.spollers.split(",")[0]);
   const spollersRegular = [...spollersArray].filter(
      (item) => !item.dataset.spollers.split(',')[0],
   );
   //получение  споллеров медиазапросов
   const spollersMedia = [...spollersArray].filter((item) => item.dataset.spollers.split(',')[0]);

   //инициализация обычных слайдеров
   if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
   }

   //инициализация слайдеров медиазапросов
   if (spollersMedia.length > 0) {
      const breakpointArray = [];
      spollersMedia.forEach((item) => {
         const params = item.dataset.spollers;
         const breakpoint = {};
         const paramsArray = params.split(',');
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
         breakpoint.item = item;
         breakpointArray.push(breakpoint);
      });

      //получаем уникальный брейкпоинт
      let mediaQueries = breakpointArray
         .map((item) => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
         .filter((item, index, arr) => arr.indexOf(item) === index); //фильтруем уникальные значения

      //Работаем с каждым брейкпоинтом
      mediaQueries.forEach((breakpoint) => {
         const paramsArray = breakpoint.split(',');
         const mediaBreakpoint = paramsArray[1];
         const mediaType = paramsArray[2];
         const matchMedia = window.matchMedia(paramsArray[0]);

         //объекты с нужными условиями
         const spollersArray = breakpointArray.filter((item) => {
            if (item.value === mediaBreakpoint && item.type === mediaType) {
               return true;
            }
         });

         // console.log(spollersArray);

         //Событие
         matchMedia.addListener(function () {
            initSpollers(spollersArray, matchMedia);
         });
         initSpollers(spollersArray, matchMedia);
      });

      //Иницианализация
      function initSpollers(spollersArray, matchMedia = false) {
         spollersArray.forEach((spollersBlock) => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
               spollersBlock.classList.add('_init');
               initSpollerBody(spollersBlock);
               spollersBlock.addEventListener('click', setSpollerAction);
            } else {
               spollersBlock.classList.remove('_init');
               initSpollerBody(spollersBlock, false);
               spollersBlock.removeEventListener('click', setSpollerAction);
            }
         });
      }
      //Работа с контентом
      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
         const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
         if (spollerTitles.length > 0) {
            spollerTitles.forEach((spollerTitle) => {
               if (hideSpollerBody) {
                  spollerTitle.removeAttribute('tabindex');
                  if (!spollerTitle.classList.contains('_active')) {
                     spollerTitle.nextElementSibling.hidden = true;
                  }
               } else {
                  spollerTitle.setAttribute('tabindex', '-1');
                  spollerTitle.nextElementSibling.hidden = false;
               }
            });
         }
      }

      //кликнутый блок
      function setSpollerAction(e) {
         const target = e.target;
         if (target.hasAttribute('data-spoller') || target.closest('[data-spoller]')) {
            const spollerTitle = target.hasAttribute('data-spoller')
               ? target
               : target.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]'); // родительский блок элем
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
               if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                  hideSpollerBody(spollersBlock);
               }
               spollerTitle.classList.toggle('_active');
               slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
         }
      }

      function hideSpollerBody(spollersBlock) {
         const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
         if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            slideUp(spollerActiveTitle.nextElementSibling, 500);
         }
      }
   }
}

//========================================================================================================================================================
//SlideToggle
let slideUp = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, pading';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   }
};
let slideDown = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, pading';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   }
};
let slideToggle = (target, duration = 500) => {
   if (target.hidden) {
      return slideDown(target, duration);
   } else {
      return slideUp(target, duration);
   }
};
