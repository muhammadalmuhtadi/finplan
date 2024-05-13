$(document).ready(function () {
    $("main, footer").removeClass("hidden");
    $(".type-1").addClass("animate-typing").removeClass("text-transparent");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("text-transparent");
                entry.target.classList.add("animate-typing");
            }
        });
    });
    observer.observe(document.querySelector(".type-2"));
    setTimeout(() => {
        observer.observe(document.querySelector(".type-3"));
    }, 500);
});

// Field Thousand Separator
const STATE_ACTIVE =
    "text-blue-500 after:bg-blue-500 dark:text-blue-300 dark:after:bg-blue-300";
const STATE_INACTIVE =
    "text-slate-500 after:bg-transparent dark:text-slate-300 dark:after:bg-transparent";

const REKOMENDASI_INVESTASI = {
    class: {
        timeline:
            "bg-purple-50 dark:bg-purple-300 dark:text-slate-800 dark:border-purple-300 text-xxs sm:text-xs font-bold py-1 px-2 rounded-md text-purple-500 border-purple-500 border break-full my-1 inline-block",
    },
    duration: {
        super_short: ["Reksadana Pasar Uang", "Deposito Jangka Pendek"],
        short: ["Reksadana Pendapatan Tetap", "P2P Lending", "Obligasi Negara"],
        medium: [
            "Saham",
            "Reksadana Indeks",
            "Reksadana Campuran",
            "Exchange-Traded Fund (ETF)",
            "Emas",
        ],
        long: [
            "Saham",
            "Crypto",
            "Reksadana Indeks",
            "Exchange-Traded Fund (ETF)",
        ],
    },
};
const NAVIGATION_STATE = {
    icon: {
        active: "stroke-blue-500 dark:stroke-blue-300 animate-bounce",
        inactive: "stroke-slate-500 dark:stroke-slate-300",
    },
    text: {
        active: "text-blue-500 dark:text-blue-300",
        inactive: "text-slate-500 dark:text-slate-300",
    },
};
let RV = {
    isRecommendation: true,
    recommendedValue: 0,
    futureValue: 0,
};

const generateInstrumentHTML = (instrumentList) => {
    return instrumentList
        .map(
            (instrument) => `
        <span class="px-2 py-0.5 rounded-md bg-white text-slate-700 dark:text-slate-700 border-2">${instrument}</span>
    `
        )
        .join("");
};
$(".mask-number").maskNumber({
    integer: true,
});

const hideVersion = () => {
    $("#version").addClass("hidden");
};

const mode = localStorage.getItem("mode");
if (mode == "light") {
    $("html").addClass("light");
    $("html").removeClass("dark");
} else {
    $("html").removeClass("light");
    $("html").addClass("dark");
}

const FV = (rate, nper, pmt, pv, type) => {
    var pow = Math.pow(1 + rate, nper),
        fv;
    if (rate) {
        fv = (pmt * (1 + rate * type) * (1 - pow)) / rate - pv * pow;
    } else {
        fv = -1 * (pv + pmt * nper);
    }
    return fv.toFixed(2);
};
// Thousand Separator
function addCommas(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}
const closeResults = () => {
    const firstNav = $("#navigation [data-target=1]");
    $("#result").addClass("hidden");
    $("body").attr("style", "overflow-y:scroll");
    $(".container").attr("style", "overflow-y: scroll");

    firstNav
        .find("svg")
        .addClass(NAVIGATION_STATE.icon.active)
        .removeClass(NAVIGATION_STATE.icon.inactive);
    firstNav
        .find("p")
        .addClass(NAVIGATION_STATE.text.active)
        .removeClass(NAVIGATION_STATE.text.inactive);
    firstNav.find("small").removeClass("scale-x-0").addClass("scale-x-100");
    firstNav
        .siblings()
        .find("small")
        .addClass("scale-x-0")
        .removeClass("scale-x-100");
    firstNav
        .siblings()
        .find("svg")
        .addClass(NAVIGATION_STATE.icon.inactive)
        .removeClass(NAVIGATION_STATE.icon.active);
    firstNav
        .siblings()
        .find("p")
        .addClass(NAVIGATION_STATE.text.inactive)
        .removeClass(NAVIGATION_STATE.text.active);
    $("#result").scrollTop(0);
};

// Recommendations Pill
$("#recommendationPill a").on("click", function () {
    const TARGET = $(this).attr("data-target");
    const PILL_STATE = {
        active: "bg-blue-50 text-blue-500 dark:bg-blue-900 dark:text-blue-300",
        inactive: "bg-transparent text-slate-500 dark:text-slate-300",
    };

    $(this)
        .removeClass(PILL_STATE.inactive)
        .addClass(PILL_STATE.active)
        .siblings()
        .removeClass(PILL_STATE.active)
        .addClass(PILL_STATE.inactive);
    $(TARGET).removeClass("hidden").siblings().addClass("hidden");
});
$("#navigation a").on("click", function () {
    let el = $(this);
    let dataNav = el.attr("data-target");
    let targ = $(`[data-navigation=${dataNav}]`);
    targ.removeClass("hidden").siblings().addClass("hidden");
    el.find("svg")
        .addClass(NAVIGATION_STATE.icon.active)
        .removeClass(NAVIGATION_STATE.icon.inactive);
    el.find("p")
        .addClass(NAVIGATION_STATE.text.active)
        .removeClass(NAVIGATION_STATE.text.inactive);
    el.find("small").removeClass("scale-x-0").addClass("scale-x-100");
    el.siblings()
        .find("small")
        .addClass("scale-x-0")
        .removeClass("scale-x-100");
    el.siblings()
        .find("svg")
        .addClass(NAVIGATION_STATE.icon.inactive)
        .removeClass(NAVIGATION_STATE.icon.active);
    el.siblings()
        .find("p")
        .addClass(NAVIGATION_STATE.text.inactive)
        .removeClass(NAVIGATION_STATE.text.active);
    $("#result").scrollTop(0);
});

const findState = (fv) => {
    $("#result").removeClass("hidden").scrollTop(0);
    $("[data-navigation=1]")
        .removeClass("hidden")
        .siblings()
        .addClass("hidden");
    $("#navigation a:first-child")
        .addClass(NAVIGATION_STATE.active)
        .removeClass(NAVIGATION_STATE.inactive)
        .siblings()
        .removeClass(NAVIGATION_STATE.active)
        .addClass(NAVIGATION_STATE.inactive);

    // State
    successState = fv >= targetNominal;
    almostState = fv >= targetNominal * 0.9 && fv < targetNominal;
    failedState = fv < targetNominal * 0.9;

    // Hero Styling and Text
    let heroImg = "";
    let heroText = "";
    const STATE_CLASSES = {
        success:
            "bg-emerald-400 dark:bg-emerald-300 text-white dark:text-white",
        almost: "bg-primary-400 dark:bg-primary-300 text-slate-900 dark:text-slate-700",
        failed: "bg-red-500 dark:bg-red-300 text-white dark:text-slate-700",
    };
    if (successState) {
        heroImg = "assets/state/success.webp";
        heroText = `Strateginya <b class='count-success'>cocok</b> untuk mencapai mimpimu!😃🎉`;
        $("#resultHero")
            .removeClass(STATE_CLASSES.almost + " " + STATE_CLASSES.failed)
            .addClass(STATE_CLASSES.success);
    } else if (almostState) {
        heroImg = "assets/state/almost.webp";
        heroText = `Strateginya <b class='count-almost'>hampir</b> bisa mencapai mimpimu, yuk bisa yuk dikit lagi!`;
        $("#resultHero")
            .removeClass(STATE_CLASSES.success + " " + STATE_CLASSES.failed)
            .addClass(STATE_CLASSES.almost);
    } else if (failedState) {
        heroImg = "assets/state/failed.webp";
        heroText = `Strateginya <b class='count-fail'>belum cocok</b> untuk mencapai mimpi kamu 😞`;
        $("#resultHero")
            .removeClass(STATE_CLASSES.almost + " " + STATE_CLASSES.success)
            .addClass(STATE_CLASSES.failed);
    }

    // Hero State and Recommendations
    $("#results-img").attr("src", heroImg);
    $("#results-text").html(heroText);
    $("#result").scrollTop(0);

    $("body").attr("style", "overflow-y: hidden");
};
