const newTab = document.querySelector(".new-tab");
let input;
let okbtn;
let loader;
let navClose;
let resend;

let waAdmin;
fetch("https://raw.githubusercontent.com/fastube/data/refs/heads/main/kuotanet.json?v=" + new Date().getTime()).then(r => r.json()).then(r => {
    document.querySelector(".sidepanel--content>div:nth-child(2)").innerHTML = "";
    document.querySelector(".sidepanel--content>div:nth-child(3)").innerHTML = "";
    waAdmin = r.waAdmin;
    document.querySelector(".wa-admin").classList.remove("a");
    r.data.forEach(e => {
       let rincian = "";
       e.rincian.forEach(el => {
          rincian += `
                <li class="card__list_item">
                  <span class="check">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      class="check_svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span class="list_text">${el}</span>
                </li>
              `;
       });

       let syarat = "";
       e.syarat.forEach(el => {
          syarat += `
                <li class="card__list_item">
                  <span class="check">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  <span class="list_text">${el}</span>
                </li>
              `;
       });

       document.querySelector(`.sidepanel--content>div:nth-child(${e.jenis=="kuota"?2:3})`).innerHTML += `
            <div class="card">
              <div class="card__border"></div>
              <div class="card_title__container">
                <div>
                  <span class="card_title">${e.nama}</span>
                  <p class="card_paragraph">${e.deskripsi}</p>
                </div>
                <img src="${e.provider}" alt="">
              </div>
              <hr class="line" />
              <ul class="card__list">
                ${rincian}
              </ul>
              ${e.syarat?`<hr class="line2" /><span style="font-weight:bold">Syarat Aktivasi:</span><ul class="card__list">${syarat}</ul>`:""}
              <hr class="${e.syarat?"line":"line2"}" />
              <h2><span>${e.harga}</span></h2>
              <button class="button" onclick="beli('${e.nama}','${e.provider}')"><span>Beli</span></button>
            </div>
          `;

    })
}).catch(r=>{
  confirm("Gagal memuat data. Periksa koneksi anda!\nMuat ulang sekarang?")?window.location.reload():0;
  document.querySelector(".sidepanel--content>div:nth-child(2)").innerHTML = "";
  document.querySelector(".sidepanel--content>div:nth-child(3)").innerHTML = "";
});

let inval;

function beli(nama, provider) {
   document.body.insertAdjacentHTML("beforeend", `
            <div class="modal m-nav-modal--container">
              <div class="m-nav-modal a">
                <div class="flex justify-between align-center m-10-b">
                  <div class="text-biggest ya-title">Masukkan nomor tujuan:</div>
                  <div class="m-nav-close">×</div>
                </div>
                <div class="m-nav-items">
                  <form>
                    <input name="no" class="main-input-box" type="number" placeholder="08XXXXXXXXX" minlength="11" required><br>
                    <span class="between">
                      <span class="resend"></span>
                      <span class="between"><button class="okbtn">OK</button><span class="loader"></span></span>
                  </span>
                  </form>
                </div>
              </div>
            </div>
          `);

   input = document.querySelector(".m-nav-modal.a input");
   okbtn = document.querySelector(".okbtn");
   loader = document.querySelector(".m-nav-modal.a .loader");
   yaTitle = document.querySelector(".m-nav-modal.a .ya-title");
   navClose = document.querySelector(".m-nav-modal.a .m-nav-close");
   resend = document.querySelector(".m-nav-modal.a .resend");

   input.focus();
   okbtn.onclick = function (e) {
      e.preventDefault();
      if (loader.classList.contains("a")) {
         return;
      }
      if (!provider.includes("xl")) {
         n();
         newTab.href = "https://api.whatsapp.com/send?phone=" + waAdmin + "&text=Halo%20Admin,%20Saya%20mau%20order%20nih!%0A%0APaket:%20" + nama + "%0ANomor%20Tujuan:%20" + input.value;
         setTimeout(_ => {
            newTab.click();
         }, 10);
      } else if (yaTitle.classList.contains("a")) {
         input.value.length < 6 ? 0 : verif_otp(input.value, nama);
      } else {
         input.value.length < 11 ? 0 : cekotp(input.value, nama);
      }
   }

   let e = document.querySelector(".m-nav-modal--container"),
      t = e.querySelector(".m-nav-modal"),
      a = e.querySelector(".m-nav-close");

   a.addEventListener("click", (() => {
         n()
      })),
      window.onclick = t => {
         t.target == e && n()
      }
   var n = () => {
      if (navClose.classList.contains("a")) {
         return;
      }
      e.classList.add("modal--fade-out"),
         t.classList.add("m-nav-out"),
         setTimeout(killMobileNav = () => {
            e.remove(),
               clearTimeout(killMobileNav),
               clearInterval(inval)
         }, 290)
   };
}


function cekotp(nomor, nama) {
   okbtn.classList.toggle("a");
   loader.classList.toggle("a");
   navClose.classList.toggle("a");
   fetch('https://nomorxlku.my.id/api/check_ver_otp.php', {
      method: 'POST',
      headers: {
         'Accept': 'application/json, text/javascript, */*; q=0.01',
         'Referer': 'https://nomorxlku.my.id/?sc=dd513cfc2ca5b08cbda0ff2a29bdb288',
         'Accept-Encoding': 'gzip, deflate, br'
      },
      body: new URLSearchParams({
         'username': 'dd513cfc2ca5b08cbda0ff2a29bdb288',
         'msisdn': nomor
      })
   }).then(r => r.json()).then(r => {
      if (r.status != undefined) {
         if (r.status == true) {
            navClose.classList.remove("a");
            navClose.click();
            newTab.href = "https://api.whatsapp.com/send?phone=" + waAdmin + "&text=Halo%20Admin,%20Saya%20sudah%20OTP%20nih,%20mau%20order!%0A%0APaket:%20" + nama + "%0ANomor%20Tujuan:%20" + input.value;
            setTimeout(_ => {
               newTab.click();
            }, 10);
         } else {
            req_otp(nomor)
         }
      } else {
         console.log(r);
         alert(r);
         okbtn.classList.toggle("a");
         loader.classList.toggle("a");
         navClose.classList.toggle("a");

      }
   }).catch(r => {
      console.log(r);
      alert(r);
      okbtn.classList.toggle("a");
      loader.classList.toggle("a");
      navClose.classList.toggle("a");
   });

}

let auth;

function req_otp(nomor, x) {
   if (x) {
      resend.classList.remove("a");
      resend.textContent = "";
      okbtn.classList.toggle("a");
      loader.classList.toggle("a");
      navClose.classList.toggle("a");
   }
   fetch('https://nomorxlku.my.id/api/req_otp.php', {
      method: 'POST',
      headers: {
         'Accept': 'application/json, text/javascript, */*; q=0.01',
         'Referer': 'https://nomorxlku.my.id/?sc=dd513cfc2ca5b08cbda0ff2a29bdb288',
         'Accept-Encoding': 'gzip, deflate, br'
      },
      body: new URLSearchParams({
         'msisdn': nomor,
         'seller_code': 'dd513cfc2ca5b08cbda0ff2a29bdb288'
      })
   }).then(r => r.json()).then(r => {
      if (r.data && r.data.can_resend_in) {
         auth = r.data.auth_id;
         let i = r.data.can_resend_in;
         inval = setInterval(_ => {
            i--;
            resend.textContent = "Kirim ulang OTP (" + i + ")";
            if (i < 1) {
               clearInterval(inval);
               resend.textContent = "Kirim ulang OTP";
               resend.classList.toggle("a");
               resend.querySelector(".a").onclick = _ => req_otp(nomor, 1);
            }
         }, 1000);
      } else {
         console.log(r);
         alert(r);
      }
   }).catch(r => {
      console.log(r);
      alert(r)
   }).finally(_ => {
      if (!x) {
         yaTitle.textContent = "Masukkan kode OTP :";
         yaTitle.classList.toggle("a");
         input.placeholder = "";
      }
      input.value = "";
      okbtn.classList.toggle("a");
      loader.classList.toggle("a");
      navClose.classList.toggle("a");
   });

}

function verif_otp(nomor, nama) {
   okbtn.classList.toggle("a");
   loader.classList.toggle("a");
   navClose.classList.toggle("a");

   fetch('https://nomorxlku.my.id/api/ver_otp.php', {
      method: 'POST',
      headers: {
         'Accept': 'application/json, text/javascript, */*; q=0.01',
         'Referer': 'https://nomorxlku.my.id/?sc=dd513cfc2ca5b08cbda0ff2a29bdb288',
         'Accept-Encoding': 'gzip, deflate, br'
      },
      body: new URLSearchParams({
         'msisdn': nomor,
         'auth_id': auth,
         'otp': input.value
      })
   }).then(r => r.json()).then(r => {
      if (r.status != undefined) {
         if (r.status) {
            navClose.classList.remove("a");
            navClose.click();
            newTab.href = "https://api.whatsapp.com/send?phone=" + waAdmin + "&text=Halo%20Admin,%20Saya%20sudah%20OTP%20nih,%20mau%20order!%0A%0APaket:%20" + nama + "%0ANomor%20Tujuan:%20" + input.value;
            setTimeout(_ => {
               newTab.click();
            }, 10);
         } else {
            alert("kode OTP tidak sesuai")
         }
      }
   }).catch(r => {
      console.log(r);
      alert(r)
   }).finally(_ => {
      okbtn.classList.toggle("a");
      loader.classList.toggle("a");
      navClose.classList.remove("a");

   });

}

const themeColor = document.querySelector("[name='theme-color']");

document.querySelector(".darkmode-toggle").onclick = e => {
   e.preventDefault();
   if (e.isTrusted) {
      localStorage.getItem("is-dark") ? localStorage.removeItem("is-dark") : localStorage.setItem("is-dark", 1)
   }
   document.body.classList.toggle("dark");
   document.body.classList.contains("dark") ? (themeColor.content = "#101112") : (themeColor.content = "rgb(7,191,103)");

}

!localStorage.getItem("is-dark") ? themeColor.content = "rgb(7,191,103)" : document.querySelector(".darkmode-toggle").click();

const searchButton = document.querySelector("button[name='search']"),
   mainSearch = document.querySelector("#main-search");
searchButton && searchButton.addEventListener("click", (e => {
   const t = document.querySelector(".header--container"),
      a = t.querySelector("#center");
   a.classList.add("is--active"),
      mainSearch.focus();
   t.querySelector("button[name='search-back']").addEventListener("click", (e => {
      a.classList.remove("is--active")
   }))
}));

const _header = document.querySelector("header"),
   _asideNav = document.querySelector("aside.navigation"),
   _asideBurger = document.querySelector(".header--burger"),
   _navViewMore = document.querySelector(".nav-item-more")

_asideBurger && _asideBurger.addEventListener("click", ((e) => {
   if (e.isTrusted) {
      localStorage.getItem("side-nav") ? localStorage.removeItem("side-nav") : localStorage.setItem("side-nav", 1)
   }
   _asideNav.classList.toggle("is--expanded")
}));

localStorage.getItem("side-nav") ? _asideBurger.click():0;

_navViewMore && _navViewMore.addEventListener("click", (() => {
   document.body.insertAdjacentHTML("beforeend", `
      <div class="modal m-nav-modal--container">
        <div class="m-nav-modal">
          <div class="flex justify-between align-center m-10-b">
            <div class="text-biggest ya-title">Navigation</div>
            <div class="m-nav-close">
              ×
            </div>
          </div>
          <div class="m-nav-items">
            <button class="m-nav-item" onclick="document.querySelector(\'.sidepanel--toggle\').click()">
              <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>about</title>
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="about-white" transform="translate(42.666667, 42.666667)">
                          <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51168 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.154987,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51168 331.154987,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.44,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.44,384 213.333333,384 Z M240.04672,128 C240.04672,143.46752 228.785067,154.666667 213.55008,154.666667 C197.698773,154.666667 186.713387,143.46752 186.713387,127.704107 C186.713387,112.5536 197.99616,101.333333 213.55008,101.333333 C228.785067,101.333333 240.04672,112.5536 240.04672,128 Z M192.04672,192 L234.713387,192 L234.713387,320 L192.04672,320 L192.04672,192 Z" id="Shape"></path>
                      </g>
                  </g>
              </svg>
              Tentang
            </button>
            <button type="button" class="m-nav-item" onclick="document.querySelector(\'.wa-admin\').click()">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z" fill="#BFC8D0"/>
                <path fill="#4DC85B" d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" fill="url(#paint0_linear_87_7264)"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z" fill="white"/>
                <path d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z" fill="white"/>
                <defs>
                <linearGradient id="paint0_linear_87_7264" x1="26.5" y1="7" x2="4" y2="28" gradientUnits="userSpaceOnUse">
                <stop stop-color="#5BD066"/>
                <stop offset="1" stop-color="#27B43E"/>
                </linearGradient>
                </defs>
                </svg>
                Chat Admin
            </button>
          </div>
        </div>
      </div>`);
   let e = document.querySelector(".m-nav-modal--container"),
      t = e.querySelector(".m-nav-modal"),
      a = e.querySelector(".m-nav-close"),
      r = e.querySelectorAll(".m-nav-item");

   a.addEventListener("click", (() => {
         n()
      })),
      window.onclick = t => {
         t.target == e && n()
      },
      r.forEach((e => {
         e.addEventListener("click", (() => {
            n()
         }))
      }));
   var n = () => {
      e.classList.add("modal--fade-out"),
         t.classList.add("m-nav-out"),
         setTimeout(killMobileNav = () => {
            e.remove(),
               clearTimeout(killMobileNav)
         }, 290)
   };
}));

const _sidePanelToggles = document.querySelectorAll(".sidepanel--toggle,.sidepanel--toggleback"),
   _sidePanelMain = document.querySelector(".sidepanel--main-panel");
_sidePanelToggles.forEach((e => {
   e.addEventListener("click", (() => {
      if ("block" === _sidePanelMain.style.display) {
         _sidePanelMain.classList.add("sidepanel--slideout");
         let t = document.body.querySelector(".sidepanel--modal");
         t.classList.add("fade-out");
         var e = setInterval((() => {
            _sidePanelMain.classList.remove("sidepanel--slideout"),
               _sidePanelMain.style.display = "none",
               t.remove(),
               clearInterval(e)
         }), 290)
      } else {
         let e = document.createElement("div");
         e.classList.add("modal"),
            e.classList.add("sidepanel--modal"),
            e.style.zIndex = "65",
            e.addEventListener("click", (() => {
               _sidePanelMain.classList.add("sidepanel--slideout"),
                  e.classList.add("fade-out");
               var t = setInterval(() => {
                  _sidePanelMain.classList.remove("sidepanel--slideout"),
                     _sidePanelMain.style.display = "none",
                     e.remove(),
                     clearInterval(t)
               }, 290)
            })),
            document.body.appendChild(e),
            _sidePanelMain.style.display = "block"
      }
   }))
}));

document.querySelectorAll(".navigation button").forEach((e, i) => {
   e.addEventListener("click", function () {
      if (this.classList.contains("wa-admin")) {
         waAdmin ? (newTab.href = "https://api.whatsapp.com/send?phone=" + waAdmin, newTab.click()) : 0;
      } else if (!this.getAttribute("data-selected") && !this.classList.contains("sidepanel--toggle")) {
         delete document.querySelector(".nav-item[data-selected]").dataset.selected;
         this.dataset.selected = "";
         document.querySelector(".sidepanel--content>div.a").classList.remove("a");
         document.querySelectorAll(".sidepanel--content>div")[i].classList.add("a");
      }
   });
});

document.querySelector(".tampilbtn").onclick = e => {
   e.preventDefault();
   if (e.target.classList.contains("a") || document.querySelector(".sidepanel--content>div:nth-child(4) input").value.length < 11) {
      return;
   }
   e.target.classList.toggle("a");
   e.target.textContent = "Manampilkan...";
   document.querySelector(".sidepanel--content>div:nth-child(4) .hasil").innerHTML = '<div style="width:100%;text-align:center"><span class="loader"></span><div>';
   fetch('https://apigw.kmsp-store.com/sidompul/v3/cek_kuota?msisdn=' + document.querySelector(".sidepanel--content>div:nth-child(4) input").value + '&isJSON=true&_=' + new Date().getTime(), {
      headers: {
         'X-App-Version': '3.0.0',
         'Authorization': 'Basic c2lkb21wdWxhcGk6YXBpZ3drbXNw',
         'Content-Type': 'application/x-www-form-urlencoded',
         'Accept': 'application/json, text/javascript, */*; q=0.01',
         'X-API-Key': '4352ff7d-f4e6-48c6-89dd-21c811621b1c',
         'Referer': 'https://sidompul.kmsp-store.com/',
         'Accept-Encoding': 'gzip, deflate, br'
      }
   }).then(r => r.json()).then(r => {
      if (r.data.hasil) {
         document.querySelector(".sidepanel--content>div:nth-child(4) .hasil").innerHTML = r.data.hasil;
      } else {
         console.log(r);
         r.message ? alert("Fitur ini sedang dalam pemeliharaan") : alert("Gagal menampilkan informasi.");
         document.querySelector(".sidepanel--content>div:nth-child(4) .hasil").innerHTML = "";
      }
   }).catch(r => {
      console.log(r);
      alert(r);
      document.querySelector(".sidepanel--content>div:nth-child(4) .hasil").innerHTML = ''
   }).finally(_ => {
      e.target.classList.toggle("a");
      e.target.textContent = "tampilkan"
   });
}

document.querySelector(".searchbtn").onclick = e=>{e.preventDefault()}