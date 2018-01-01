/*---------------------------------------
* Requires and variables
* ---------------------------------------*/

// electron
const request = require('request');
const electron = require('electron');
const shell = electron.shell;
const {ipcRenderer} = electron;
const {remote} = require('electron');
let win = remote.getCurrentWindow();
// application
const imgUrlSmall = '<img src="https://files.coinmarketcap.com/static/img/coins/16x16/';
const imgUrlLarge = '<img src="https://files.coinmarketcap.com/static/img/coins/64x64/';
const imgUrlEnd = '.png">';
const oSlider = $('#oSlider');
let popList, searchContainer = [];
let rank, id, name, symbol, price, priceBtc, volume, mcap, perChange, per1h, availSup, totalSup, check, selectedCoin, btcPrice, text;
let clickedValue = 'bitcoin';
let currency = ' USD';
let currencyBtc = ' BTC';
let coinNum, oldCoinNum = 100;

/*---------------------------------------
* Start initial code/call funcs and reqs
* ---------------------------------------*/
// wait for an updateReady message
ipcRenderer.on('updateReady', function(event, text) {
    $('.update-btn').css('visibility', 'visible');
});

// when update ready and btn clicked, send a quitAndInstall message to main process
$('.update-btn').on('click', function() {
    ipcRenderer.send('quitAndInstall');
});

// force resziable option off
win.setResizable(false);

// minimize, close, refresh app
$('.fa-minus').on('click', function() {
    win.minimize();
});

$('.mClose').on('click', function() {
    win.close();
});

// open refresh overlay and disable icon
$('.fa-sync').on('click', function() {
    errReOverlay('.a4', 0);
    $('.fa-sync, .fa-cog, .fa-info-circle').css('display', 'none');
});

// toggle volume/supply on click
$('.row2 p, .row2 span').on('click', function() {
    toggleSupply();
});

// toggle usd/btc on click 
$('.coin-price, .coin-price-btc, .currency-small, .currency-small-btc, .percent-change, .percent-time').on('click', function() {
    toggleBtcPrice();
});

// search on key up
$('#search-input').keyup(function() {
    searchList();
});

// remove input validation popup
$('#search-input').removeAttr('required');

// show/hide .search list
$('#search-input').focus(function() {
    $('.search, .search-close').show();
    $('.main-container').css('height', '626px');
    win.setSize(400, 626);
});

// check theme switch, toggle dark/light mode
$('#switch1').click(function() {
    if($('body').hasClass('dark-mode')) {
        $('body').removeClass('dark-mode');
        $('body').addClass('light-mode');
        resetOpacity('light');
    } else {
        $('body').removeClass('light-mode');
        $('body').addClass('dark-mode');
        resetOpacity('dark');
    }
});

// focus action for satoshi convert
$('#convert-input').focus(function() {
    $(this).css('border-bottom', 'solid 1px var(--colored-elements)');
    $(this).removeAttr('placeholder');
});

$('#convert-input').focusout(function() {
    $(this).css('border-bottom', 'solid 1px var(--main-text)');
    $(this).attr('placeholder');
});

// clear search
$('.search-close').on('click', function() {
    clearSearch();  
});

// open about links in users default browser
$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});

// call funcs
firstCall(); 
secondCall();
errReBtns();
showOverlays('.fa-cog', '.a2', 300);
showOverlays('.fa-info-circle', '.a3', 300);
donate();
satoshiUSD();
setSearchCount();
opacity();
searchPlaceholder();
dynamicHover();

/*---------------------------------------
* Functions
* ---------------------------------------*/

// make initial api call to fill out values
function firstCall() {
    request('https://api.coinmarketcap.com/v1/ticker/?limit=' + coinNum, (error, response, body) => {
        if(!error && response.statusCode == 200) {
            popList = JSON.parse(body);
            populateData();
            mainInfo(popList);
            btcPrice = price;
            getListValue();
        } else {
        // show error overlay
        $('.fa-sync, .fa-cog, .fa-info-circle').css('display', 'none');
        $('.err-span').text(error);
        errReOverlay('.a1', 0);
        }
    });
}

// start updating values every 3min
function secondCall() {
    setInterval(() => {
        request('https://api.coinmarketcap.com/v1/ticker/' + clickedValue + '/', (error, response, body) => {
            if(!error && response.statusCode == 200) {
                body = JSON.parse(body);
                console.log(body);
                mainInfo(body);
            } else {
                // show error overlay
                $('.fa-sync, .fa-cog, .fa-info-circle').css('display', 'none');
                $('.err-span').text(error);
                errReOverlay('.a1', 0);
            }
        });
    }, 180000);
}

// handle overlays for settings/about
function showOverlays(icon, overlay, speed) {
    let x = false;
    $(icon).on('click', function() {
        if(!x) {
            $('.row1, .row2, .row3').toggleClass('hide-main');
            if(overlay === '.a2') {
                $('.fa-info-circle, .fa-sync').css('opacity', '0');
                $('.fa-info-circle, .fa-sync').css('z-index', '-1');
                $('#convert-input').focus();
            } else if(overlay === '.a3') {
                $('.fa-cog, .fa-sync').css('opacity', '0');
                $('.fa-cog, .fa-sync').css('z-index', '-1');              
            }
            $(overlay).stop().animate({
                left: 0
            }, speed, function() {
                $('.main-container').css('height', '200px');
                win.setSize(400, 200);
            });
            x = true;
        } else {
            $('.row1, .row2, .row3').toggleClass('hide-main');
            if(overlay === '.a2') {
                if(coinNum !== oldCoinNum) {
                    firstCall();
                    oldCoinNum = coinNum;
                    clickedValue = 'bitcoin';
                }
                $('.fa-info-circle, .fa-sync').css('opacity', '1');
                $('.fa-info-circle, .fa-sync').css('z-index', '1');
                $('#convert-input, #convert-display').val("");
            } else if(overlay === '.a3') {
                $('.fa-cog, .fa-sync').css('opacity', '1');
                $('.fa-cog, .fa-sync').css('z-index', '1');
            }
            $(overlay).stop().animate({
                left: -401
            }, speed, function() {
                clearSearch();
            });
            x = false;
        }
    });
}

// show/hide error/refresh overlay
function errReOverlay(overlay, value, id) {
    $(overlay).stop().animate({
        left: value
    }, 300, function() {
        $('.row1, .row2, .row3').toggleClass('hide-main');
        $('.main-container').css('height', '200px');
        win.setSize(400, 200);
        clearSearch();
        if(overlay === '.a1' && value === -401) {
            $('.err-span').text("");
            win.reload();
        } else if(overlay === '.a4' && value === -401 && id === 'refresh-btn') {
            win.reload();
        }
    });
}

// error/refresh overlay button action 
function errReBtns() {
    $('#err-btn, #refresh-btn, #back-btn').on('click', function() {
        if(this.id == 'err-btn') {
            $('.fa-sync, .fa-cog, .fa-info-circle').css('display', 'inline-block');
            errReOverlay('.a1', -401);
        } else if(this.id == 'refresh-btn') {
            let clicked = this.id;
            errReOverlay('.a4', -401, clicked);
            $('.fa-sync, .fa-cog, .fa-info-circle').css('display', 'inline-block');
        } else if(this.id == 'back-btn') {
            errReOverlay('.a4', -401);
            $('.fa-sync, .fa-cog, .fa-info-circle').css('display', 'inline-block');
        }
        
    });
}

// get clicked value from list and call refresh
function getListValue() {
    $(".search a").on("click", (el) => {
        clickedValue = $(el.target).text();
        console.log(clickedValue);
        // update 'clickedValue' with proper id
        let obj = searchArr(clickedValue, popList);
        clickedValue = obj.id;
        refreshMain();           
    });
}

// search coins based on clicked value and return coin obj
function searchArr(val, arr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].name === val) {
            return arr[i];
        }
    }
}

// update main screen from list click
function refreshMain() {
    request('https://api.coinmarketcap.com/v1/ticker/' + clickedValue + '/', (error, response, body) => {
        if(!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log(body);
            mainInfo(body);
            $('.search, .search-close').hide();
            $('.main-container').css('height', '200px');
            clearSearch();
        } else {
            // show error overlay
            $('.fa-sync, .fa-cog, .fa-info-circle').css('display', 'none');
            $('.err-span').text(error);
            errReOverlay('.a1', 0);
        }
    });
}

// pull info for main screen
function mainInfo(arr) {
    [name, id, symbol, price, rank, volume, mcap, perChange, per1h, availSup, totalSup, priceBtc] = [
        arr[0]["name"], arr[0]["id"], arr[0]["symbol"], arr[0]["price_usd"],
        arr[0]["rank"], nFormat('$', arr[0]["24h_volume_usd"]), nFormat('$', arr[0]["market_cap_usd"]), 
        Math.sign(Number(arr[0]["percent_change_1h"])), arr[0]["percent_change_1h"], nFormat("", arr[0]["available_supply"]),
        nFormat("", arr[0]["total_supply"]), arr[0]["price_btc"]
    ];
    fillMain();
}

function nFormat(curr, num) {
    if(Number(num) > 999999999) {
        return curr + (num/1000000000).toFixed(2) + 'B';
    } else if(Number(num) > 999999) {
        return curr + (num/1000000).toFixed(2) + 'M';
    } else if(Number(num) > 999) {
        return curr + (num/1000).toFixed(2) + 'K';
    } else {
        return num;
    }
}

// fill main screen
function fillMain() {
    $('.coin-picture, .coin-name, .coin-rank, .coin-volume, .coin-mcap, .currency-small, .currency-small-2').fadeOut('fast', function() {
        $('.coin-picture').html(imgUrlLarge + id + imgUrlEnd).fadeIn('fast');
        $('.coin-name').html(name + ' ' + '(' + symbol + ')').fadeIn('fast');
        $('.coin-rank').html(rank).fadeIn('fast');
        $('.coin-mcap').html(mcap).fadeIn('fast');
        $('.coin-volume').html(volume).fadeIn('fast');
        $('.currency-small').text(currency).fadeIn('fast');
        $('.currency-small-2').text(currency).fadeIn('fast');
        $('.currency-small-btc').text(currencyBtc).fadeIn('fast'); 
        $('.coin-asup').html(availSup).fadeIn('fast');
        $('.coin-tsup').html(totalSup).fadeIn('fast'); 
        $('.symbol-small').text(' ' + symbol).fadeIn('fast');
    });
    fillPricePercent(1, '#25DAA5');
    fillPricePercent(-1, 'rgb(245, 56, 103)'); 
    fillPricePercent(0, 'rgba(255, 255, 255, 0.75)');
    console.log(perChange);
}

// toggle bewtween displaying volume/marketcap or avail/total supply on main
function toggleSupply() {
    $('.div-volume, .div-mcap, .div-asup, .div-tsup').toggleClass('hide');
}

// toggle between usd/btc price
function toggleBtcPrice() {
    $('.coin-price, .currency-small, .coin-price-btc, .currency-small-btc').toggleClass('hide');
}

// check 1h percent change and fill info/change color
function fillPricePercent(change, color) {
    if(perChange === change) {
        $('.coin-price, .coin-price-btc, .percent-change, .percent-time').fadeOut('fast', function() {
            $('.coin-price').text('$' + price).fadeIn('fast');
            $('.coin-price-btc').text(priceBtc).fadeIn('fast');
            $('.percent-change').text('(' + per1h + '%)').fadeIn('fast');
            $('.percent-time').text('1hr').fadeIn('fast');
            $('.coin-price, .coin-price-btc, .percent-change').css('color', color);
        });     
    }   
}

// populate search list
function populateData() {
    $('.search-table').empty();
    for(var i = 0; i < popList.length; i++) {
        rank = popList[i]["rank"];
        id = popList[i]["id"];
        name = popList[i]["name"];
        symbol = popList[i]["symbol"];
        generateDiv();
    }
}

// generate div for search list
function generateDiv() {
    $('.search-table').append('<tr class="row"><td class="list-rank">' + rank + '</td><td class="list-image">' + imgUrlSmall + id + imgUrlEnd + '</td><td class="listDiv"><a href="#">' + 
    name + '</a> (' + symbol + ')</td></tr>');
}

// check input value and update coinNum value
function setSearchCount() {
    $('#coin-count').bind('input', function() {
        x = parseInt($('#coin-count').val().replace(/\,/g,''));
        if(isNaN(x * 2) || x <= 0) {
            console.log('nan error');
            coinNum = 100;
        } else if(x >= 1) {
            coinNum = x;
            console.log(coinNum);
            console.log(typeof(coinNum));
        }
    });
}

// filter search 
function searchList() {
    var search = $('#search-input').val().toUpperCase();
    $('.search .row').each(function() {
        text = $(this).text().toUpperCase();
        if(text.indexOf(search) > -1 || search == "") {
            $(this).css("display", "table-row");
        } else {
            $(this).css("display", "none");
        }
    });   
}

// convert satoshi to usd
function satoshiUSD() {
    $('#convert-input').bind('input', function() {
        x = $('#convert-input').val().toString().replace(/\,/g,'');
        if(x >= 1000) {
            y = x.toString().split(".");
            y[0] = y[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            z = y.join('.');
            $('#convert-input').val(y);
        }
        if(isNaN(x * 2)) {
            $('#convert-display').val(0);
            console.log('nan error');
        } else {
            $.get("http://api.coindesk.com/v1/bpi/currentprice.json", function(data) {
                var body = JSON.parse(data);
                var btcPrice = body.bpi.USD.rate.replace(/\,/g,'') * x;
                var satUSD = (btcPrice * 0.00000001);
                a = (satUSD).toFixed(8);
                b = a.toString().split(".");
                b[0] = b[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                c = b.join('.');
                $('#convert-display').val(c);
            });
        }
    });
}

// opacity slider
function opacity() {
    oSlider.on('input', function() {
        if($('body').hasClass('dark-mode')) {
            $('.main-container').css("background", "rgba(67, 77, 90, " + $(this).val() + ")");
            $('.menu, .a2, .a3').css("background", "rgba(38, 44, 51, " + $(this).val() + ")");
        } else if($('body').hasClass('light-mode')) {
            $('.main-container').css("background", "rgba(216, 225, 232, " + $(this).val() + ")");
            $('.menu, .a2, .a3').css("background", "rgba(126, 140, 159, " + $(this).val() + ")");
        }
    });
}

function resetOpacity(theme) {
    if(theme === 'dark') {
        $('.main-container').css("background", "rgba(67, 77, 90, " + $('#oSlider').val() + ")");
        $('.menu, .a2, .a3').css("background", "rgba(38, 44, 51, " + $('#oSlider').val() + ")");
    } else if(theme === 'light') {
        $('.main-container').css("background", "rgba(216, 225, 232, " + $('#oSlider').val() + ")");
        $('.menu, .a2, .a3').css("background", "rgba(126, 140, 159, " + $('#oSlider').val() + ")");
    }   
}

// donate info
function donate() {
    $('.donate-list').change(function() {
        let value = $(this).val();
        if(value === "btc") {
            $('.qrcode').attr('src', 'src/img/btc-qr.png');
            $('.donate-address span').text('15As8L4n1Z2oyw9UfsTpfC4KR9Q7h8eUNL');
        } else if(value === "eth") {
            $('.qrcode').attr('src', 'src/img/eth-qr.png');
            $('.donate-address span').text('0x015f4ca16753e7De0d042dc4E0E06F8b09585834');
        } else if(value === "ltc") {
            $('.qrcode').attr('src', 'src/img/ltc-qr.png');
            $('.donate-address span').text('LbpJYgkeAme2ca2pGFuP1dF8AioSKKErTG');
        }
    });
}

// clear #search-input val
function clearSearch() {
    $('#search-input').val("");
    $('.search .row').each(function() {
        $(this).css("display", "table-row");
     });
     $('.search, .search-close').hide();
     $('.fa-compress').show();
     $('.main-container').css('height', '200px');
    win.setSize(400, 200);
}

// show/hide placeholder text for search
function searchPlaceholder() {
    $('#search-input').data('holder', $('#search-input').attr('placeholder'));
        $('#search-input').focusin(function () {
            $(this).attr('placeholder', '');
        });
        $('#search-input').focusout(function () {
            $(this).attr('placeholder', $(this).data('holder'));
    });
}

// prevent hover getting stuck on search list
function dynamicHover() {
    $(document).on('mouseenter', 'a', function() {
        $(this).css('font-weight', '600');
    });
    $(document).on('mouseleave', 'a', function() {
        $(this).css('font-weight', '200');
    });
}

