var oldarray = [];

jQueryCode = function (jQuery) {
    if (typeof checkDuplicationcollection === 'undefined') {
        checkDuplicationcollection = false;
        console.log('areviews rating loaded');
        if (jQuery('.areviews_product_item').length > 0) {
            var r = jQuery(".areviews_product_item").map(function () {return jQuery(this).data("product-id")}).get();
            oldarray = r;
            jQuery.ajax({
                url: "/apps/aliexpress_reviews",
                data: {ids: r, collection_reviews: "collection_reviews"},
                type: "POST",
                success: function (r) {
                    var t = r.desing.star_color;
                    jQuery("body").append("<style>.areviews_rating font { margin-left: 2px; }.areviews_rating{font-size: 14px;}.rating,.rating-text,.rating-count{display:none !important;}/*.fa{font-family: FontAwesome;}*/.areviews_product_item .fa,.areviews_product_item .fa-star-half-o:before,.areviews_product_item .fa-star-o:before,.areviews_product_item .fa-star:before  {font-family: FontAwesome!important;font-size: " + r.desing.icon_size + "px;}.areviews_product_item .fal:before,.areviews_product_item .fab:before,.areviews_product_item .far:before,.areviews_product_item .fas:before{font-weight: inherit!important;}.areviews_product_item .fal:before,.areviews_product_item .fab:before, .areviews_product_item .far:before,.areviews_product_item .fas:before,.areviews_product_item .far,.areviews_product_item .fas {font-family: 'Font Awesome 5 Free'!important;font-size: " + r.desing.icon_size + "px;}.areviews_product_item .no_icon {color: #9e9e9e !important;}.areviews_product_item .half_icon { webkit-text-fill-color: transparent; -moz-text-fill-color: transparent; -o-text-fill-color: transparent; -ms-text-fill-color: transparent; text-fill-color: transparent; background: -webkit-linear-gradient(to right," + t + " 50%, #9e9e9e 50%); background: -o-linear-gradient(to right," + t + " 50%, #9e9e9e 50%); background: -moz-linear-gradient(to right, " + t + " 50%, #9e9e9e 50%); background: -ms-linear-gradient(to right," + t + " 50%, #9e9e9e 50%); background: linear-gradient(to right," + t + " 50%, #9e9e9e 50%); color: transparent!important; -webkit-background-clip: text; background-clip: text }@media(max-width: 420px){.areviews_product_item .fal:before, .areviews_product_item .fab:before, .areviews_product_item .far:before, .areviews_product_item .fas:before, .areviews_product_item .far, .areviews_product_item .fas {font-size: 12px!important; }.areviews_rating{font-size: 12px;}}</style>");
                    jQuery.each(r, function (t, e) {
                        var a, i = "", o = "";
                        if (typeof e.comments_count != "undefined") {
                            1 == r.desing.s_status ? a = e.comments_count.replace(',', '') > 1 ? r.desing.plural_reviews : r.desing.reviews_name : (a = r.desing.reviews_name, i = "(", o = ")"), jQuery(".areviews_stars" + e.product_id).append('<div class="areviews_rating" style="margin-top: 5px;">' + get_starts(e.average, r.desing) + '<span style="' + r.desing.reviews_style + '"> ' + i + e.comments_count + o + " " + a + "</span></div>")
                        }
                    });
                }
            });
        }
    }
};


function get_starts(rating, design) {
    var counter = 0;
    var data = "";

    if ("stars" == design.rating_style) {
        // Loop for adding full stars
        for (var i = 0; i < ~~rating; i++) {
            data += '<i style="margin-left: 2px; color:' + design.star_color + ';" class="fas fa-star" aria-hidden="true"></i>';
        }

        // Condition to add half and empty stars
        if (rating - 5 < 0) {
            for (var o = 0; o < 5 - rating; o++) {
                if (o < 5 - rating && -1 !== (5 - rating).toString().indexOf(".") && 0 === counter) {
                    if (rating % 1 != 0 && rating.toString().split(".")[1] >= 8) {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="fas fa-star" aria-hidden="true"></i>';
                    }else if (rating % 1 != 0 && rating.toString().split(".")[1] <= 2) {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="far fa-star" aria-hidden="true"></i>';

                    } else {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="fas fa-star-half-alt" aria-hidden="true"></i>';
                    }
                } else {
                    data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="far fa-star" aria-hidden="true"></i>';
                }

                counter++;
            }
        }
    } else if ("custom" == design.rating_style) {
        // Loop for adding custom full icons
        for (var i = 0; i < ~~rating; i++) {
            data += '<i style="margin-left: 2px; color:' + design.star_color + ';" class="' + design.custom_icon + '" aria-hidden="true"></i>';
        }

        // Condition to add custom half and empty icons
        if (rating - 5 < 0) {
            for (var o = 0; o < 5 - rating; o++) {
                if (o < 5 - rating && -1 !== (5 - rating).toString().indexOf(".") && 0 === counter) {
                    if (rating % 1 != 0 && rating.toString().split(".")[1] >= 8) {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="' + design.custom_icon + '" aria-hidden="true"></i>';
                    }else if (rating % 1 != 0 && rating.toString().split(".")[1] <= 2) {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="no_icon ' + design.custom_icon + '" aria-hidden="true"></i>';

                    } else {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="half_icon  ' + design.custom_icon + '" aria-hidden="true"></i>';
                    }
                } else {
                    data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="no_icon ' + design.custom_icon + '" aria-hidden="true"></i>';
                }

                counter++;
            }
        }
    } else {
        // Loop for adding full icons of other rating_style
        for (var i = 0; i < ~~rating; i++) {
            data += '<i style="margin-left: 2px; color:' + design.star_color + ';" class="' + design.rating_style + '" aria-hidden="true"></i>';
        }

        // Condition to add half and empty icons of other rating_style
        if (rating - 5 < 0) {
            for (var o = 0; o < 5 - rating; o++) {
                if (o < 5 - rating && -1 !== (5 - rating).toString().indexOf(".") && 0 === counter){
                    if (rating % 1 != 0 && rating.toString().split(".")[1] >= 8) {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="' + design.rating_style + '" aria-hidden="true"></i>';
                    }else if (rating % 1 != 0 && rating.toString().split(".")[1] <= 2) {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="no_icon ' + design.rating_style + '" aria-hidden="true"></i>';

                    } else {
                        data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="half_icon ' + design.rating_style + '" aria-hidden="true"></i>';
                    }
                } else {
                    data += '<i style="margin-left: 2px;color:' + design.star_color + ';" class="no_icon ' + design.rating_style + '" aria-hidden="true"></i>';
                }

                counter++;
            }
        }
    }

    return data;
}
function load_areviws_app(e,a){var t=document.createElement("script");t.type="text/javascript",t.readyState?t.onreadystatechange=function(){"loaded"!=t.readyState&&"complete"!=t.readyState||(t.onreadystatechange=null,a())}:t.onload=function(){a()},t.src=e,document.getElementsByTagName("head")[0].appendChild(t)}


var arevrefreshId = setInterval(function () {
    if (document.getElementsByClassName('areviews_product_item').length > 0) {
        var areviews_timer = 0;
        if (window.location.href.indexOf('products') >= 0) areviews_timer = 1200;

        setTimeout(function () {
            var crawlerAgentRegex = /(bot|googlebot|crawler|spider|robot|crawling|googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/i;
            var re = new RegExp(crawlerAgentRegex);
            if (!re.test(navigator.userAgent)) {
            "undefined" == typeof jQuery || "undefined"==typeof jQuery.ajax ||  parseFloat(jQuery.fn.jquery) < 1.7 ? load_areviws_app("../areviewsapp.com/js/jquery_2.2.4.min.js", function () {jQuery191 = jQuery.noConflict(!0), jQueryCode(jQuery191)}) : jQueryCode(jQuery);

                var css = document.createElement('link');
                css.href = '../cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css';
                css.rel = 'stylesheet';
                css.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(css);

            }


            clearInterval(arevrefreshId);

        }, areviews_timer);
        clearInterval(arevrefreshId);

    }
}, 200);

function show_infiniti_areviews() {
    var e = jQuery(".areviews_product_item").map(function () {if (0 == jQuery(this).find(".areviews_rating").length) return jQuery(this).data("product-id")}).get();
    oldarray.push.apply(oldarray, e);
    var array3 = jQuery.grep(e, function (element) {
        return jQuery.inArray(element, oldarray) !== -1;
    });
    if (array3 === undefined || array3.length == 0) {
        return 0;
    }
    jQuery.ajax({
        url: "/apps/aliexpress_reviews",
        data: {ids: array3, collection_reviews: "collection_reviews"},
        type: "POST",
        success: function (e) {
            jQuery.each(e, function (s, i) {
                var a;
                if (typeof i.comments_count != "undefined") {
                    a = 1 == e.desing.s_status && i.comments_count.replace(',', '') > 1 ? e.desing.plural_reviews : e.desing.reviews_name;
                    var t = jQuery(".areviews_stars" + i.product_id);
                    t.find(".areviews_rating").remove(), t.append('<div class="areviews_rating" style="margin-top: 5px;">' + get_starts(i.average, e.desing) + '<span style="' + e.desing.reviews_style + '"> ' + i.comments_count + " " + a + "</span></div>")
                }
            });
        }
    });
}
