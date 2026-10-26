"use strict";
/* ===== CENTRAL MENU DATA — edit prices / items / offers here only ===== */
const MENU = [
  { id:"pasta", ar:"الباستا", en:"Pasta", items:[
    { ar:"بيني ألفريدو", en:"Penne Alfredo", price:190 },
    { ar:"سباجيتي كرات اللحم", en:"Spaghetti Meatballs", price:215 },
    { ar:"بيني كاربونارا", en:"Penne Carbonara", price:140 },
    { ar:"فيتوتشيني لحم مدخن", en:"Fettuccine Smoked Beef", price:215 },
    { ar:"بيني أرابياتا", en:"Penne Arrabbiata", price:205 },
    { ar:"بيني بيستو", en:"Penne Pesto", price:215 },
    { ar:"بيني تونة", en:"Penne Tuna", price:240 },
    { ar:"سباجيتي لحم مدخن", en:"Spaghetti Smoked Beef", price:250 },
    { ar:"بيني سي فود", en:"Penne Seafood", price:265 } ]},
  { id:"noodles", ar:"النودلز", en:"Noodles", items:[
    { ar:"نودلز لحم وخضار", en:"Beef & Vegetable Noodles", price:180 },
    { ar:"نودلز دجاج", en:"Chicken Noodles", price:160 },
    { ar:"نودلز روبيان", en:"Shrimp Noodles", price:210 },
    { ar:"نودلز سجق", en:"Oriental Sausage Noodles", price:150 },
    { ar:"نودلز كبدة", en:"Liver Noodles", price:145 },
    { ar:"نودلز سي فود", en:"Seafood Noodles", price:230 } ]},
  { id:"maqluba", ar:"المقلوبة", en:"Maqluba", items:[
    { ar:"مقلوبة سجق", en:"Oriental Sausage Maqluba", price:185 },
    { ar:"مقلوبة خضار", en:"Vegetable Maqluba", price:130 },
    { ar:"مقلوبة كبدة", en:"Liver Maqluba", price:160 },
    { ar:"مقلوبة شاورما فراخ", en:"Chicken Shawarma Maqluba", price:180 },
    { ar:"مقلوبة ستراجانوف", en:"Stroganoﬀ Maqluba", price:205 },
    /* Duplicate name kept as supplied — owner to confirm 205 vs 195 */
    { ar:"مقلوبة ستراجانوف", en:"Stroganoﬀ Maqluba", price:195 } ]},
  { id:"drinks", ar:"المشروبات", en:"Drinks", items:[
    { ar:"مياه", en:"Water", price:20 },
    { ar:"كولا", en:"Cola", price:30 } ]},
  /* Offers: add objects like { ar:"...", en:"...", price:123 } to show this section automatically */
  { id:"offers", ar:"العروض", en:"Offers", items:[] }
];

const TEXT = {
  ar:{ title:"قائمة الطعام", sub:"الأسعار بالجنيه المصري", vat:"الأسعار غير شاملة ضريبة القيمة المضافة.",
       currency:"ج.م", btn:"English", logoAlt:"شعار مبهرة", foot:"مبهرة | MOBHARA", nav:"أقسام القائمة", page:"مبهرة | MOBHARA — قائمة الطعام" },
  en:{ title:"Our Menu", sub:"Prices in Egyptian pounds", vat:"Prices do not include VAT.",
       currency:"EGP", btn:"العربية", logoAlt:"MOBHARA logo", foot:"MOBHARA | مبهرة", nav:"Menu categories", page:"MOBHARA | مبهرة — Our Menu" }
};

let lang = "ar";
const $ = id => document.getElementById(id);
const visibleSections = () => MENU.filter(s => s.items.length > 0);
const formatPrice = p => lang === "ar" ? `${p} ${TEXT.ar.currency}` : `${p} ${TEXT.en.currency}`;

function renderItem(item){
  const other = lang === "ar" ? "en" : "ar";
  return `<li class="item"><div class="names"><div class="name-primary">${item[lang]}</div>
    <div class="name-secondary" lang="${other}" dir="${other==="ar"?"rtl":"ltr"}">${item[other]}</div></div>
    <span class="price">${formatPrice(item.price)}</span></li>`;
}
function renderSection(s){
  return `<section class="menu-section" id="${s.id}" aria-labelledby="h-${s.id}">
    <h2 id="h-${s.id}">${s[lang]}</h2><ul class="items">${s.items.map(renderItem).join("")}</ul></section>`;
}
function renderNav(){
  $("catList").innerHTML = visibleSections().map(s => `<li><a href="#${s.id}" data-id="${s.id}">${s[lang]}</a></li>`).join("");
}
function setHeaderHeight(){
  document.documentElement.style.setProperty("--header-h", $("siteHeader").offsetHeight + "px");
}
function render(){
  const t = TEXT[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t.page;
  $("menuTitle").textContent = t.title;
  $("menuSub").textContent = t.sub;
  $("vatNotice").textContent = t.vat;
  $("footName").textContent = t.foot;
  $("langBtn").textContent = t.btn;
  $("langBtn").setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
  $("logoImg").alt = t.logoAlt;
  $("catNav").setAttribute("aria-label", t.nav);
  $("menuRoot").innerHTML = visibleSections().map(renderSection).join("");
  renderNav();
  setHeaderHeight();
  updateActive();
}

function updateActive(){
  const line = $("siteHeader").offsetHeight + 40;
  let current = null;
  visibleSections().forEach(s => { const el = $(s.id); if (el && el.getBoundingClientRect().top <= line) current = s.id; });
  document.querySelectorAll("#catList a").forEach(a => a.classList.toggle("active", a.dataset.id === current));
}

$("langBtn").addEventListener("click", () => { lang = lang === "ar" ? "en" : "ar"; render(); });
$("catList").addEventListener("click", e => {
  const a = e.target.closest("a"); if (!a) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $(a.dataset.id).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block:"start" });
});
window.addEventListener("scroll", updateActive, { passive:true });
window.addEventListener("resize", () => { setHeaderHeight(); updateActive(); });
render();
