// Random String
var stringArray = [
    "Kalau kita serius dengan mimpi kita, pasti kita akan merencanakan strategi yang detail, agar kemungkinan tercapainya lebih besar.",
    "Mimpi yang besar dan gila, harus diiringi dengan usaha dan rencana yang besar juga. ",
    "Mimpi emang kadang terasa impossible, sampe kita merencanakannya dan ubah jadi i’m possible.",
    "A goal without a plan is just a wish",
    "Failing to plan is planning to fail",
    "Sukses itu lebih dari keberuntungan dan privilege, kita perlu persiapan untuk menyambut kesempatan itu.",
    "Hitung aset yang diperlukan untuk pensiun di umur yang kamu mau",
    "Hitung persyaratan financial freedom dan pensiun dini versi kamu",
    "Prioritaskan dana pensiun orang tuamu dulu, karena mereka yang akan pensiun duluan",
    "Biar ga terjebak dalam sandwich generation, bantu orang tuamu siapin dana pensiun mulai dari sekarang",
];
var randomNumber = Math.floor(Math.random() * stringArray.length);

$("#hero-text").html(stringArray[randomNumber]);

// Variables
let pengeluaranPerBulan,
    pengeluaranPerTahun,
    usiaSekarang,
    targetUsiaPensiun,
    inflasiPercentage,
    pengeluaranPerTahunPensiun,
    targetNominal,
    uangSekarang,
    targetInvestasi,
    targetReturn,
    targetTahun,
    inflasiValue = 0;
let futval = 0;

// Set Default Value
inflasiPercentage = 4;

// Interactions
// Step 1
$("#pengeluaranPerBulan").on("input", function () {
    pengeluaranPerBulan = parseFloat($(this).val().replace(/,/g, ""));
    pengeluaranPerTahun = pengeluaranPerBulan * 12;
    $("#pengeluaranPerTahun").html(
        `Rp${addCommas(pengeluaranPerTahun.toFixed(0))}`
    );
    if ($(this).val()) {
        $(".step-2").toggleClass("hidden", false);
        if (
            $("#usiaSekarang").val() &&
            $("#targetUsiaPensiun").val() &&
            $("#inflasi").val()
        ) {
            targetTahun = targetUsiaPensiun - usiaSekarang;
            inflasiValue = Math.pow(1 + inflasiPercentage / 100, targetTahun);
            pengeluaranPerTahunPensiun = pengeluaranPerTahun * inflasiValue;
            targetNominal = pengeluaranPerTahunPensiun / 0.04;
            $("#pengeluaranPerTahunPensiun").html(
                `Rp${addCommas(pengeluaranPerTahunPensiun.toFixed(0))}`
            );
            $("#targetNominal").html(
                `Rp${addCommas(targetNominal.toFixed(0))}`
            );
        }
    } else {
        $(".step-2").toggleClass("hidden", true);
    }
});

// Step 2
$("#usiaSekarang").on("input", function () {
    usiaSekarang = parseInt($(this).val());
    if ($(this).val()) {
        $(".step-3").toggleClass("hidden", false);
    } else {
        $(".step-3").toggleClass("hidden", true);
    }
});

$("#targetUsiaPensiun").on("input", function () {
    targetUsiaPensiun = parseInt($(this).val());
    if (targetUsiaPensiun <= usiaSekarang) {
        $(".step-4, .step-5").addClass("hidden");
        $("#ageGapError").removeClass("hidden");
    } else {
        $(".step-4, .step-5").removeClass("hidden");
        $("#ageGapError").addClass("hidden");
        targetTahun = targetUsiaPensiun - usiaSekarang;
        $("#targetTahun, .targetTahun").html(`${targetTahun} Tahun`);
        if ($("#inflasi").val()) {
            inflasiValue = Math.pow(1 + inflasiPercentage / 100, targetTahun);
            pengeluaranPerTahunPensiun = pengeluaranPerTahun * inflasiValue;
            targetNominal = pengeluaranPerTahunPensiun / 0.04;
            $("#pengeluaranPerTahunPensiun").html(
                `Rp${addCommas(pengeluaranPerTahunPensiun.toFixed(0))}`
            );
            $("#targetNominal").html(
                `Rp${addCommas(targetNominal.toFixed(0))}`
            );
        }
    }
});

$("#inflasi").on("input", function () {
    inflasiPercentage = $(this).val();
    inflasiValue = Math.pow(1 + inflasiPercentage / 100, targetTahun);
    pengeluaranPerTahunPensiun = pengeluaranPerTahun * inflasiValue;
    targetNominal = pengeluaranPerTahunPensiun / 0.04;
    $("#pengeluaranPerTahunPensiun").html(
        `Rp${addCommas(pengeluaranPerTahunPensiun.toFixed(0))}`
    );
    $("#targetNominal").html(`Rp${addCommas(targetNominal.toFixed(0))}`);
    if ($(this).val()) {
        $(".step-5").removeClass("hidden");
    } else {
        $(".step-5").addClass("hidden");
    }
});

// Step 3
$("#uangSekarang").on("input", function () {
    uangSekarang = parseFloat($(this).val().replace(/,/g, ""));
    if ($(this).val()) {
        $(".step-6").removeClass("hidden");
    } else {
        $(".step-6").addClass("hidden");
    }
});
$("#targetInvestasi").on("input", function () {
    targetInvestasi = parseFloat($(this).val().replace(/,/g, ""));

    if ($(this).val()) {
        $(".step-7").removeClass("hidden");
    } else {
        $(".step-7").addClass("hidden");
    }
});

$("#targetReturn").on("input", function () {
    targetReturn = $(this).val();
    if ($(this).val()) {
        $(".step-8").removeClass("hidden");
    } else {
        $(".step-8").addClass("hidden");
    }
});

// Recommendation Functions
const generateNominalRecommendation = (nominal, value) => {
    let theNode = "nominal";
    let nom = nominal;
    let fv = value;
    const threshold = targetNominal * 0.2;

    while (fv < targetNominal) {
        nom += fv > threshold ? 50000 : 200000;
        fv = -FV(
            targetReturn / 100 / 12,
            targetTahun * 12,
            nom,
            uangSekarang,
            1
        );
    }
    $(".targetInvestasi__recommendation").html(`
        <span class='text-red-500 dark:text-red-300 line-through mr-1'>
            Rp${addCommas(nominal.toFixed(0))}
        </span>
        <i class='fas fa-caret-right mr-1 text-sm'></i>
        Rp${addCommas(nom.toFixed(0))}
    `);

    $(`.hasilInvestasi__${theNode}`).html(`
        <i class='fas fa-chevron-circle-up text-green-500 dark:text-green-300 mr-1 text-sm'></i>
        Rp${addCommas(fv.toFixed(0))}
    `);

    let variant = "";
    if (targetTahun < 1) {
        variant = REKOMENDASI_INVESTASI.duration.super_short;
    } else if (targetTahun >= 1 && targetTahun <= 5) {
        variant = REKOMENDASI_INVESTASI.duration.short;
    } else if (targetTahun > 5 && targetTahun <= 10) {
        variant = REKOMENDASI_INVESTASI.duration.medium;
    } else if (targetTahun > 10) {
        variant = REKOMENDASI_INVESTASI.duration.long;
    }
    $(`.variantInvestasi__${theNode}`).html(
        variant
            .map(
                (box) => `
                        <span class="${REKOMENDASI_INVESTASI.class.timeline}">${box}</span>
                    `
            )
            .join("")
    );

    let yearStart = "Tahun 1";
    let yearMid = "Tahun 2";
    let yearEnd = "Tahun " + targetTahun;
    let yearMidNode = $(`#timelineMid--main__${theNode}`);
    yearMidNode.toggleClass("hidden", true);

    if (targetTahun == 1) {
        yearStart = "Awal Tahun 1";
        yearMid = "";
        yearEnd = "Akhir Tahun 1";
    } else if ((targetTahun == 2) | (targetTahun == 3)) {
        yearStart = "Tahun 1";
        yearMid = "";
        yearEnd = `Tahun ${targetTahun} `;
    } else if (targetTahun > 3) {
        startMonth = "Tahun 1";
        yearStart = "Tahun 1";
        yearMid = `Tahun ${
            targetTahun <= 5 ? targetTahun - 2 : targetTahun - 3
        }`;
        yearEnd = `Tahun ${targetTahun} `;
        yearMidNode.toggleClass("hidden", false);
    }

    $(`#timelineStart--label__${theNode}`).html(`${yearStart}`);
    $(`#timelineMid--label__${theNode}`).html(`${yearMid}`);
    $(`#timelineEnd--label__${theNode}`).html(`${yearEnd}`);

    $(`.timelineResult__${theNode}`).html(
        "<i class='fas fa-plus-minus mr-2 text-xs'></i>Rp" +
            addCommas(fv.toFixed(0))
    );

    let pokok = uangSekarang + nom * targetTahun * 12;
    let bunga = fv - pokok;

    let pokokPercent = (pokok / fv) * 100;
    let bungaPercent = (bunga / fv) * 100;

    $(`#pokokInvestasiPercentage__${theNode}`)
        .html(`${pokokPercent.toFixed(1)}%`)
        .css("width", `${pokokPercent}%`);
    $(`#bungaInvestasiPercentage__${theNode}`)
        .html(`${bungaPercent.toFixed(1)}%`)
        .css("width", `${bungaPercent}%`);

    $(`#pokokInvestasiStrat__${theNode} span`).html(
        `Rp${addCommas(pokok.toFixed(0))}`
    );
    $(`#bungaInvestasiStrat__${theNode} span`).html(
        `Rp${addCommas(bunga.toFixed(0))}`
    );

    RV.recommendedValue = nom;
    RV.futureValue = fv;
};

const generateReturnRecommendation = (y, ret, value) => {
    let theNode = "return";
    let r = parseInt(ret);
    const year = parseInt(y);
    let fv = value;

    let maxReturn = 15;
    if (year >= 6 && year <= 10) maxReturn = 20;
    else if (year > 10) maxReturn = 30;

    while (fv < targetNominal && r < maxReturn) {
        r++;
        fv = -FV(
            r / 100 / 12,
            targetTahun * 12,
            targetInvestasi,
            uangSekarang,
            1
        );
        $("#recommendationPill a:last-child").removeClass("hidden");
        $("#recommendationPill")
            .removeClass("grid-cols-2")
            .addClass("grid-cols-3");
    }

    if (r >= maxReturn) {
        $("#recommendationPill a:last-child").addClass("hidden");
        $("#recommendationPill")
            .removeClass("grid-cols-3")
            .addClass("grid-cols-2");
    }

    $("#add-return").html(`
        <span class='text-red-500 dark:text-red-300 line-through mr-1'>
            ${ret}%
        </span>
        <i class='fas fa-caret-right mr-1 text-sm'></i>
        ${r}% / Tahun
    `);

    $("#res-ret").html(`
        <i class='fas fa-chevron-circle-up text-green-500 dark:text-green-300 mr-1 text-sm'></i>
        Rp${addCommas(fv.toFixed(0))}
    `);

    $(".targetReturn__recommendation").html(`
        <span class='text-red-500 dark:text-red-300 line-through mr-1'>
            ${ret}%
        </span>
        <i class='fas fa-caret-right mr-1 text-sm'></i>
        ${r}% / Tahun
    `);

    $(`.hasilInvestasi__${theNode}`).html(`
        <i class='fas fa-chevron-circle-up text-green-500 dark:text-green-300 mr-1 text-sm'></i>
        Rp${addCommas(fv.toFixed(0))}
    `);

    let variant = "";
    if (targetTahun < 1) {
        variant = REKOMENDASI_INVESTASI.duration.super_short;
    } else if (targetTahun >= 1 && targetTahun <= 5) {
        variant = REKOMENDASI_INVESTASI.duration.short;
    } else if (targetTahun > 5 && targetTahun <= 10) {
        variant = REKOMENDASI_INVESTASI.duration.medium;
    } else if (targetTahun > 10) {
        variant = REKOMENDASI_INVESTASI.duration.long;
    }
    $(`.variantInvestasi__${theNode}`).html(
        variant
            .map(
                (box) => `
                        <span class="${REKOMENDASI_INVESTASI.class.timeline}">${box}</span>
                    `
            )
            .join("")
    );

    // Timeline
    let yearStart = "Tahun 1";
    let yearMid = "Tahun 2";
    let yearEnd = "Tahun " + targetTahun;
    let yearMidNode = $(`#timelineMid--main__${theNode}`);
    yearMidNode.toggleClass("hidden", true);

    if (targetTahun == 1) {
        yearStart = "Awal Tahun 1";
        yearMid = "";
        yearEnd = "Akhir Tahun 1";
    } else if ((targetTahun == 2) | (targetTahun == 3)) {
        yearStart = "Tahun 1";
        yearMid = "";
        yearEnd = `Tahun ${targetTahun} `;
    } else if (targetTahun > 3) {
        startMonth = "Tahun 1";
        yearStart = "Tahun 1";
        yearMid = `Tahun ${
            targetTahun <= 5 ? targetTahun - 2 : targetTahun - 3
        }`;
        yearEnd = `Tahun ${targetTahun} `;
        yearMidNode.toggleClass("hidden", false);
    }

    $(`#timelineStart--label__${theNode}`).html(`${yearStart}`);
    $(`#timelineMid--label__${theNode}`).html(`${yearMid}`);
    $(`#timelineEnd--label__${theNode}`).html(`${yearEnd}`);

    $(`.timelineResult__${theNode}`).html(
        "<i class='fas fa-plus-minus mr-2 text-xs'></i>Rp" +
            addCommas(fv.toFixed(0))
    );

    let pokok = uangSekarang + targetInvestasi * targetTahun * 12;
    let bunga = fv - pokok;

    let pokokPercent = (pokok / fv) * 100;
    let bungaPercent = (bunga / fv) * 100;

    $(`#pokokInvestasiPercentage__${theNode}`)
        .html(`${pokokPercent.toFixed(1)}%`)
        .css("width", `${pokokPercent}%`);
    $(`#bungaInvestasiPercentage__${theNode}`)
        .html(`${bungaPercent.toFixed(1)}%`)
        .css("width", `${bungaPercent}%`);

    $(`#pokokInvestasiStrat__${theNode} span`).html(
        `Rp${addCommas(pokok.toFixed(0))}`
    );
    $(`#bungaInvestasiStrat__${theNode} span`).html(
        `Rp${addCommas(bunga.toFixed(0))}`
    );
};
const generateYearRecommendation = (year, value) => {
    let theNode = "duration";
    let recommendedYear = parseInt(year);
    let newFutureValue = value;
    let adjustedNominalTarget = targetNominal;
    let inflation = inflasiPercentage; // Initialize inflation
    let newInflation = 0;
    let stepOneInflation = 0;
    let stepTwoInflation = 0;
    let stepThreeInflation = 0;
    let stepFourInflation = 0;
    let finalInflation = 0;
    let used = "";
    let updatedInflation = 0;

    while (newFutureValue < adjustedNominalTarget) {
        recommendedYear++;

        if (recommendedYear <= 5) {
            updatedInflation = Math.pow(1 + inflation / 100, recommendedYear);
            used = "% Inflation = " + inflation + "%";
            stepOneInflation = updatedInflation;
        } else if (recommendedYear >= 6 && recommendedYear <= 10) {
            if (stepOneInflation == 0) {
                stepOneInflation = Math.pow(
                    1 + inflation / 100,
                    recommendedYear
                );
            }
            stepTwoInflation = stepOneInflation * (1 + 3 / 100);
            for (let loopOne = 7; loopOne <= recommendedYear; loopOne++) {
                stepTwoInflation = stepTwoInflation * (1 + 3 / 100);
            }
            stepThreeInflation = stepTwoInflation;
            used = "% Inflation = 3%";
        } else {
            if (stepThreeInflation == 0) {
                stepThreeInflation = Math.pow(
                    1 + inflation / 100,
                    recommendedYear
                );
            }
            stepFourInflation = stepThreeInflation * (1 + 1 / 100);
            for (let loopTwo = 12; loopTwo <= recommendedYear; loopTwo++) {
                stepFourInflation = stepFourInflation * (1 + 1 / 100);
            }
            newInflation = stepFourInflation;
            used = "% Inflation = 1%";
        }
        finalInflation = updatedInflation;
        if (stepOneInflation != 0) {
            finalInflation = stepOneInflation;
        }
        if (stepTwoInflation != 0) {
            finalInflation = stepTwoInflation;
        }
        if (stepThreeInflation != 0) {
            finalInflation = stepThreeInflation;
        }
        if (stepFourInflation != 0) {
            finalInflation = stepFourInflation;
        }
        newFutureValue = -FV(
            targetReturn / 100 / 12,
            recommendedYear * 12,
            targetInvestasi,
            uangSekarang,
            1
        );
        adjustedNominalTarget = targetNominal * finalInflation;
    }

    let pokok = uangSekarang + targetInvestasi * recommendedYear * 12;
    let bunga = newFutureValue - pokok;

    let pokokPercent = (pokok / newFutureValue) * 100;
    let bungaPercent = (bunga / newFutureValue) * 100;

    $(`#pokokInvestasiPercentage__${theNode}`)
        .html(`${pokokPercent.toFixed(1)}%`)
        .css("width", `${pokokPercent}%`);
    $(`#bungaInvestasiPercentage__${theNode}`)
        .html(`${bungaPercent.toFixed(1)}%`)
        .css("width", `${bungaPercent}%`);

    $(`#pokokInvestasiStrat__${theNode} span`).html(
        `Rp${addCommas(pokok.toFixed(0))}`
    );
    $(`#bungaInvestasiStrat__${theNode} span`).html(
        `Rp${addCommas(bunga.toFixed(0))}`
    );

    // Variant
    let variant = "";
    if (recommendedYear < 1) {
        variant = REKOMENDASI_INVESTASI.duration.super_short;
    } else if (recommendedYear >= 1 && recommendedYear <= 5) {
        variant = REKOMENDASI_INVESTASI.duration.short;
    } else if (recommendedYear > 5 && recommendedYear <= 10) {
        variant = REKOMENDASI_INVESTASI.duration.medium;
    } else if (recommendedYear > 10) {
        variant = REKOMENDASI_INVESTASI.duration.long;
    }
    $(`.variantInvestasi__${theNode}`).html(
        variant
            .map(
                (box) => `
                        <span class="${REKOMENDASI_INVESTASI.class.timeline}">${box}</span>
                    `
            )
            .join("")
    );

    // Timeline
    let yearStart = "Tahun 1";
    let yearMid = "Tahun 2";
    let yearEnd = "Tahun " + recommendedYear;
    let yearMidNode = $(`#timelineMid--main__${theNode}`);
    yearMidNode.toggleClass("hidden", true);

    if (recommendedYear == 1) {
        yearStart = "Awal Tahun 1";
        yearMid = "";
        yearEnd = "Akhir Tahun 1";
    } else if ((recommendedYear == 2) | (recommendedYear == 3)) {
        yearStart = "Tahun 1";
        yearMid = "";
        yearEnd = `Tahun ${recommendedYear * 12} `;
    } else if (recommendedYear > 3) {
        startMonth = "Tahun 1";
        yearStart = "Tahun 1";
        yearMid = `Tahun ${
            recommendedYear <= 5 ? recommendedYear - 2 : recommendedYear - 3
        }`;
        yearEnd = `Tahun ${recommendedYear} `;
        yearMidNode.toggleClass("hidden", false);
    }

    $(`#timelineStart--label__${theNode}`).html(`${yearStart}`);
    $(`#timelineMid--label__${theNode}`).html(`${yearMid}`);
    $(`#timelineEnd--label__${theNode}`).html(`${yearEnd}`);

    $(`.timelineResult__${theNode}`).html(
        "<i class='fas fa-plus-minus mr-2 text-xs'></i>Rp" +
            addCommas(newFutureValue.toFixed(0))
    );

    $(".targetTahun__recommendation").html(
        `<span class='text-red-500 dark:text-red-300 line-through mr-1'>${year} Tahun</span>` +
            "<i class='fas fa-caret-right mr-1 text-sm'></i>" +
            `${recommendedYear} Tahun`
    );

    $(`.hasilInvestasi__${theNode}`).html(
        "<i class='fas fa-chevron-circle-up text-green-500 dark:text-green-300 mr-1 text-sm'></i>" +
            "Rp" +
            addCommas(newFutureValue.toFixed(0))
    );
    $("#addYearFV").html(
        `<span class='text-red-500 dark:text-red-300 line-through mr-1'>${addCommas(
            targetNominal.toFixed(0)
        )}</span>
        <i class='fas fa-caret-right mr-1 text-sm'></i>
        Rp${addCommas(adjustedNominalTarget.toFixed(0))}`
    );
};

const timelineCount = () => {
    let theNode = "timeline";
    var futureValue = -FV(
        targetReturn / 100 / 12,
        targetTahun * 12,
        targetInvestasi,
        uangSekarang,
        1
    );
    let variant = "";
    if (targetTahun < 1) {
        variant = REKOMENDASI_INVESTASI.duration.super_short;
    } else if (targetTahun >= 1 && targetTahun <= 5) {
        variant = REKOMENDASI_INVESTASI.duration.short;
    } else if (targetTahun > 5 && targetTahun <= 10) {
        variant = REKOMENDASI_INVESTASI.duration.medium;
    } else if (targetTahun > 10) {
        variant = REKOMENDASI_INVESTASI.duration.long;
    }
    $(`.variantInvestasi__${theNode}`).html(
        variant
            .map(
                (box) => `
                        <span class="${REKOMENDASI_INVESTASI.class.timeline}">${box}</span>
                    `
            )
            .join("")
    );

    // Nominal Recommendation Timeline
    let yearStart = "Tahun 1";
    let yearMid = "Tahun 2";
    let yearMidNode = $(`#timelineMid--main__${theNode}`);
    let yearEnd = "Tahun " + targetTahun;
    yearMidNode.toggleClass("hidden", true);

    if (targetTahun == 1) {
        yearStart = "Awal Tahun 1";
        yearMid = "";
        yearEnd = "Akhir Tahun 1";
    } else if ((targetTahun == 2) | (targetTahun == 3)) {
        yearStart = "Tahun 1";
        yearMid = "";
        yearEnd = `Tahun ${targetTahun}`;
    } else if (targetTahun > 3) {
        yearStart = "Tahun 1";
        yearMid = `Tahun ${
            targetTahun > 5 ? targetTahun - 3 : targetTahun - 2
        }`;
        yearEnd = `Tahun ${targetTahun}`;
        yearMidNode.toggleClass("hidden", false);
    }
    $(`#timelineStart--label__${theNode}`).html(`${yearStart}`);
    $(`#timelineMid--label__${theNode}`).html(`${yearMid}`);
    $(`#timelineEnd--label__${theNode}`).html(`${yearEnd}`);

    // The Timeline
    $(`.timelineResult__${theNode}`).html(
        `Rp${addCommas(futureValue.toFixed(0))}`
    );
};

const generateRecommendations = (fv) => {
    generateNominalRecommendation(targetInvestasi, fv);
    generateReturnRecommendation(targetTahun, targetReturn, fv);
    generateYearRecommendation(targetTahun, fv);
};

// Main Functions
$("#start-count").on("click", function () {
    $("#dlModule").toggleClass("hidden", true);
    $("#inputName").val("");
    var futureValue = -FV(
        targetReturn / 100 / 12,
        targetTahun * 12,
        targetInvestasi,
        uangSekarang,
        1
    );
    var pokok = uangSekarang + targetInvestasi * targetTahun * 12;
    var bunga = futureValue - pokok;
    var neg = -(futureValue - targetNominal);

    var pokokPercent = (pokok / futureValue) * 100;
    var bungaPercent = (bunga / futureValue) * 100;

    $("#pokokInvestasiPercentage__main")
        .html(`${pokokPercent.toFixed(1)}%`)
        .css("width", `${pokokPercent}%`);
    $("#bungaInvestasiPercentage__main")
        .html(`${bungaPercent.toFixed(1)}%`)
        .css("width", `${bungaPercent}%`);

    $("#pokokInvestasiStrat__main span").html(
        `Rp${addCommas(pokok.toFixed(0))}`
    );
    $("#bungaInvestasiStrat__main span").html(
        `Rp${addCommas(bunga.toFixed(0))}`
    );

    $("#result").removeClass("hidden");
    findState(futureValue);

    $(".uangSekarang").html(`Rp${addCommas(uangSekarang.toFixed(0))}`);
    $(".targetNominal").html(`Rp${addCommas(targetNominal.toFixed(0))}`);
    $(".targetInvestasi").html(`Rp${addCommas(targetInvestasi.toFixed(0))}`);
    // $(".varYear").html(`${a} Tahun`);
    $(".targetTahun").html(`${targetTahun} Tahun`);
    $(".targetReturn").html(`${targetReturn}% / Tahun`);
    $(".hasilInvestasi").html(`Rp${addCommas(futureValue.toFixed(0))}`);
    if (neg > 0) {
        $("#neg-inv")
            .show()
            .html(`Kurang Rp${addCommas(neg.toFixed(0))}`);
    } else {
        $("#neg-inv").hide().html("");
    }
    $("#res-pokok").html(`Rp${addCommas(pokok.toFixed(0))}`);
    $("#res-bunga").html(`Rp${addCommas(bunga.toFixed(0))}`);

    $("#navRecommendation").addClass("hidden");
    $("#navTimeline").removeClass("hidden");
    if (successState) {
        timelineCount();
        RV.isRecommendation = false;
    } else if (almostState || failedState) {
        RV.isRecommendation = true;
        generateRecommendations(futureValue);
        timelineCount();
        $("#navRecommendation").removeClass("hidden");
        $("#navTimeline").addClass("hidden");
        $(".targetInvestasi").html(
            `Rp${addCommas(targetInvestasi.toFixed(0))}`
        );
        $(".targetReturn").html(`${targetReturn}% / Tahun`);
        $(".targetTahun").html(`${targetTahun} Tahun`);
        $(".slide-2").css("display", "block");
    }
    futval = futureValue;
    fillDownloadImage();
});

$("#inputName").on("input", function () {
    $(".dreamName").html($(this).val());
    $(this).val()
        ? $("#dlModule").removeClass("hidden")
        : $("#dlModule").addClass("hidden");
});

const fillDownloadImage = () => {
    const instrumentHTML =
        targetTahun < 1
            ? generateInstrumentHTML(REKOMENDASI_INVESTASI.duration.super_short)
            : targetTahun <= 5
            ? generateInstrumentHTML(REKOMENDASI_INVESTASI.duration.short)
            : targetTahun <= 10
            ? generateInstrumentHTML(REKOMENDASI_INVESTASI.duration.medium)
            : generateInstrumentHTML(REKOMENDASI_INVESTASI.duration.long);

    $(".dreamTarget").html("bangun dana pensiun");
    $(".dreamName").html(`____`);
    $(".dreamDream").html(`mencapai Rp${addCommas(targetNominal.toFixed(0))}`);
    $(".dreamNominal").html(`Rp${addCommas(targetNominal.toFixed(0))}`);
    $(".dreamInvest").html(
        `Investasi Rp${addCommas(targetInvestasi.toFixed(0))}/bulan`
    );
    $(".dreamStrat").html(
        `(Selama ${targetTahun} tahun, di produk dengan return ${targetReturn}% per tahun)`
    );

    $(".dreamInstrument").html(instrumentHTML);

    $(".dreamLength").html(`${targetTahun} tahun`);

    if (RV.isRecommendation) {
        $(".isRecommendation").html("Rekomendasi strategi ");
        $(".dreamInvest").html(
            `Investasi Rp${addCommas(RV.recommendedValue.toFixed(0))}/bulan`
        );
        $(".dreamGoal").html(`Rp${addCommas(RV.futureValue.toFixed(0))}`);
    } else {
        $(".isRecommendation").html("Strategi ");
        $(".dreamGoal").html(`Rp${addCommas(futval.toFixed(0))}`);
        $(".dreamInvest").html(
            `Investasi Rp${addCommas(targetInvestasi.toFixed(0))}/bulan`
        );
    }
};

$(".downloadSquare").on("click", function () {
    $("#downloading").removeClass("hidden");
    var unix = Math.round(+new Date() / 1000);

    const dataType = $(this).attr("data-type");

    if (dataType == "light") {
        $("#mainSquareJPG").removeClass("dark");
        $("#mainSquareJPG > div")
            .removeClass("bg-dl-square-d")
            .addClass("bg-dl-square-l");
    } else {
        $("#mainSquareJPG").addClass("dark");
        $("#mainSquareJPG > div")
            .removeClass("bg-dl-square-l")
            .addClass("bg-dl-square-d");
    }
    var node = document.getElementById("mainSquareJPG");
    var scaleBy = 1;
    var w = 1024;
    var h = 1024;
    var canvas = document.createElement("canvas");
    canvas.width = w * scaleBy;
    canvas.height = h * scaleBy;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    var context = canvas.getContext("2d");
    context.scale(scaleBy, scaleBy);
    const style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet?.insertRule(
        "body > div:last-child img { display: inline-block; }"
    );

    html2canvas(node, {
        allowTaint: true,
        useCORS: true,
        scale: 1,
        width: 1024,
        height: 1024,
        canvas: canvas,
        scrollX: 0,
        scrollY: 0,
    }).then((canvas) => {
        style.remove();
        var link = document.createElement("a");
        link.download = `menghitung_mimpi_dana_pensiun_${unix}.png`;
        link.href = canvas.toDataURL();
        link.click();
        // $("#previewx").append(canvas);
        $("#downloading").addClass("hidden");
    });
});
$(".downloadStory").on("click", function (type) {
    $("#downloading").removeClass("hidden");
    var unix = Math.round(+new Date() / 1000);

    const dataType = $(this).attr("data-type");

    if (dataType == "light") {
        $("#mainStoryJPG").removeClass("dark");
        $("#mainStoryJPG > div")
            .removeClass("bg-dl-story-d")
            .addClass("bg-dl-story-l");
    } else {
        $("#mainStoryJPG").addClass("dark");
        $("#mainStoryJPG > div")
            .removeClass("bg-dl-story-l")
            .addClass("bg-dl-story-d");
    }
    var node = document.getElementById("mainStoryJPG");
    var scaleBy = 1;
    var w = 1080;
    var h = 1920;
    var canvas = document.createElement("canvas");
    canvas.width = w * scaleBy;
    canvas.height = h * scaleBy;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    var context = canvas.getContext("2d");
    context.scale(scaleBy, scaleBy);
    const style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet?.insertRule(
        "body > div:last-child img { display: inline-block; }"
    );

    html2canvas(node, {
        allowTaint: true,
        useCORS: true,
        scale: 1,
        width: 1080,
        height: 1920,
        canvas: canvas,
        scrollX: 0,
        scrollY: 0,
    }).then((canvas) => {
        style.remove();
        var link = document.createElement("a");
        link.download = `menghitung_mimpi_dana_pensiun_${unix}.png`;
        link.href = canvas.toDataURL();
        link.click();
        // $("#previewx").append(canvas);
        $("#downloading").addClass("hidden");
    });
});
