// document.addEventListener('DOMContentLoaded', function () {
    
//      var c, currentScrollTop = 0,
//         app = document.querySelector('#app'),
//         navbar = document.querySelector('#app>.header');

//         let i = 0;
//      window.addEventListener('scroll', function () {
//         var a = window.scrollY;
//         var b = navbar.clientHeight;
//         var d = b - (b-50);
        
//         ++i
//         let isShow = app.classList.contains('show')
//         let isHide = app.classList.contains('hide')

//         currentScrollTop = a;
//       //  console.log(i)
//         if (c < currentScrollTop ) {
//           if(!isHide && !isShow){
//             app.classList.add('hide');
//           } else if (!isHide && isShow){
//             app.classList.replace('show','hide');
//           }

//         } else if (c > 0) {
//           if (!isShow && isHide){
//             app.classList.replace('hide','show');
//           } else if (!isShow){
//             app.classList.add('show');
//           };
//         }


//         if (a < 50){
//           navbar.classList.remove('scrolling');
//         } else {
//           navbar.classList.add('scrolling');
//         };

//         c = currentScrollTop;
       
//     //    console.log(a, b);
//     });
    
//   });