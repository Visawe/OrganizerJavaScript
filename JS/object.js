/**
 * Created by денисенко.ольга on 04.04.2017.
 */
var currentDate;
var currentStartDate;
var currentEndDate;

var countOfDayInMounts = 0;
var arrayOfDayInMounts = {}; //ассоциативный массив
var arrayOfevent = []; //хранит EventObj все вычитанные из локал стораже
//currentDate = new Date();
//createCalendar("calendar",  currentDate.getFullYear(), currentDate.getMonth());
readLocalStorageCalendar();
function createCalendar(id, year, month) {
    //var elem = document.getElementById(id);
    var elem = $("#"+id);
    var arrayNameMonth = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

    var mon = month; // месяцы в JS идут от 0 до 11, а не от 1 до 12 - тут корректировать!!!!!!!!!!!!лишняя переменная
    var d = new Date(year, mon);
   $("#month").html(arrayNameMonth[month] + " " + year);
    var table = '<div class="Week"><div class="dayWeek">пн</div><div class="dayWeek">вт</div><div class="dayWeek">ср</div><div class="dayWeek">чт</div><div class="dayWeek">пт</div><div class="dayWeek">сб</div><div class="dayWeek">вс</div></div><div class="Week">';

    // заполнить первый ряд от понедельника
    // и до дня, с которого начинается месяц
    // * * * | 1  2  3  4
    //считаем дни, до начала текущего месяца
    var daysPreviousMonth = 0;
    for (var i = 0; i < getDay(d); i++) {
       daysPreviousMonth++;
    }
    d.setDate(d.getDate() - daysPreviousMonth);
    for (var i = 0; i < daysPreviousMonth; i++) {
        table += '<div class="dayA anotherMonth"><div class="dayNumber">' + d.getDate() + '</div></div>';
        d.setDate(d.getDate() + 1);
    }

    var countWeeks = 1;
    //data-countEvent - число событий в ячейке
    // ячейки календаря с датами
    while (d.getMonth() == mon) {
        table += '<div class="day" id='+'"'+d.getDate()+'" data-countEvent="0"><div class="dayNumber">' + d.getDate() + '</div></div>';

        if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
            table += '</div><div class="Week">';
            countWeeks++;
        }
        arrayOfDayInMounts[d.getDate()] = new FloarOfDay (0,0,0,0,0);//массив дни с событиями
        d.setDate(d.getDate() + 1);
        currentEndDate = new Date(d);
    }
    currentStartDate = new Date ( currentDate.getFullYear(), currentDate.getMonth());
    console.log(currentStartDate);
    console.log (currentEndDate);
    // добить таблицу пустыми ячейками, если нужно
    if (getDay(d) != 0) {
        for (var i = getDay(d); i < 7; i++) {
            table += '<div class="dayA anotherMonth"><div class="dayNumber">' + d.getDate() + '</div></div>';
            d.setDate(d.getDate() + 1);
        }
    }
    else {
        countWeeks--;
    }

    // закрыть таблицу
    table += '</div>';

    // только одно присваивание innerH
    //newDiv.style.width = width + "px";
    var height = 40 + countWeeks*111;
    document.getElementById("calendar").style.height = height + "px";
    elem.html(table);
}

function getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
    var day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}


//var serialObj = JSON.stringify(obj); //сериализуем его
$( function() {
    $( "#datepicker" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
    $( "#datepicker2" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
} );

function EventObj(dateStart, dateEnd, name, description, idEvent) {
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.name = name;
    this.description = description;
    this.position;
    this.idEvent = idEvent;
}

function FloarOfDay (first, second, third, fourth, more) {
    this.first = first;
    this.second = second;
    this.third = third;
    this.fourth = fourth;
    this.more = more;
    this.events = [];
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function findEventsInLocalStorage() {
    var events = JSON.parse(localStorage.getItem("event"));
    if(events) {
        for (var i = 0; i < events.length; i++) {
            addEventToCalendar(events[i], false);
            arrayOfevent.push(events[i]);
        }
    }
}
function findEventByID(idEvent) {
    for (i= 0; i <arrayOfevent.length; i++)
    {
        if(arrayOfevent[i].idEvent == idEvent)
        {
            return arrayOfevent[i];
        }
    }
    return 0;
}
function createMore(divStartEvent,countEvent, id, position) {
    if(arrayOfDayInMounts[id].more != 1) {
        var countEventShow = 0;
        if (arrayOfDayInMounts[id].first != 0) {
            countEventShow += 1;
        }
        if (arrayOfDayInMounts[id].second != 0) {
            countEventShow += 1;
        }
        if (arrayOfDayInMounts[id].third != 0) {
            countEventShow += 1;
        }
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "MoreEvent");
        var idMore = id + "MoreEvent";
        newDiv.setAttribute("id", idMore);
        newDiv.innerHTML = "+" + (countEvent - countEventShow);
        divStartEvent.appendChild(newDiv);
        arrayOfDayInMounts[id].more = 1;
    }
}

function paintMoreEvent(countEvent, position ,id) {
    var divStartEvent = document.getElementById(id);
    var countEventShow = 0;
    if(arrayOfDayInMounts[id].first != 0)
    {
        countEventShow +=1;
    }
    if(arrayOfDayInMounts[id].second != 0)
    {
        countEventShow +=1;
    }
    if(arrayOfDayInMounts[id].third != 0)
    {
        countEventShow +=1;
    }
    if(position == 5 && arrayOfDayInMounts[id].more == 0) {
        if(arrayOfDayInMounts[id].fourth != 0 ) {
            var className = arrayOfDayInMounts[id].fourth + "IdEvent";
            var divEvents = document.getElementsByClassName(className);
            //нужно не только скрыть этот див, но и добавить more для скрытых
            for(var i =0; i<divEvents.length; i++)
            {
                divEvents[i].style.display = "none"; //скрыли все элементы с этим idEvent
                //divEvents[i].remove();
            }
            var EventHide =  findEventByID(arrayOfDayInMounts[id].fourth);
            var dateStart = new Date( EventHide.dateStart.valueOf());
            var day = dateStart.getDate(); //получить начало события
            var dateEnd = new Date( EventHide.dateEnd.valueOf());
            var dayEnd = dateEnd.getDate();//получить конец события
            for(var i = day; i<=dayEnd; i++)
            {
                if(i != id ) {
                    var divStartEvent2 = document.getElementById(i);
                    var countEvent = Number(divStartEvent2.getAttribute('data-countEvent'));
                    createMore(divStartEvent2,countEvent,i,5);
                }
            }
        }
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "MoreEvent");
        var idMore = id + "MoreEvent";
        newDiv.setAttribute("id", idMore);
        newDiv.innerHTML = "+" + (countEvent - countEventShow);
        divStartEvent.appendChild(newDiv);
        arrayOfDayInMounts[id].more = 1;
    }
    else
    {
        var txt ="";
        var MoreEvent =   document.getElementById( id + "MoreEvent");
        txt += "+" + (countEvent - countEventShow);
        MoreEvent.innerHTML = txt;
    }
}

function setEventforOneDay(id , NewEvent1, position) { // эту оставить
    var divStartEvent = document.getElementById(id);

    arrayOfDayInMounts[id].events.push( NewEvent1); //добавляет события в каждый конкретный день

    //установка количества событий в дне
    var countEvent = Number(divStartEvent.getAttribute('data-countEvent'));
    countEvent++;
    divStartEvent.setAttribute('data-countEvent',String(countEvent));


    if( position < 4 || (position==4 && arrayOfDayInMounts[id].more != 1)) {

    }
    else
    {
        paintMoreEvent(countEvent, position ,id);
    }

}
function checkFreePlace(dayStart,dayEnd) { // эту оставить проверить есть ли место под значение
    for (var i = dayStart; i <= dayEnd; i++)
    {
        if (arrayOfDayInMounts[i].first != 0)
        {
            for (var i = dayStart; i <= dayEnd; i++)
            {
                if (arrayOfDayInMounts[i].second != 0)
                {
                    for (var i = dayStart; i <= dayEnd; i++)
                    {
                        if (arrayOfDayInMounts[i].third != 0)
                        {
                            for (var i = dayStart; i <= dayEnd; i++) {
                                if (arrayOfDayInMounts[i].fourth != 0) {
                                    return 5;
                                }
                            }
                            return 4;
                        }
                    }
                    return 3;
                }
            }
            return 2;
        }
    }
    return 1;
}
function setPositionForDay(dayStart,dayEnd, position, idEvent) { // эту оставить
        for (var i = dayStart; i <= dayEnd; i++) {
            if(position == 1)
            {
                arrayOfDayInMounts[i].first = idEvent;
            }
            if(position == 2)
            {
                arrayOfDayInMounts[i].second = idEvent;
            }
            if(position == 3)
            {
                arrayOfDayInMounts[i].third = idEvent;
            }
            if(position == 4)
            {
                arrayOfDayInMounts[i].fourth = idEvent;
            }
        }

}

function DivChildOfDay (first, second, third, fourth) {
    this.divFirst = first;
    this.divSecond = second;
    this.divThird = third;
    this.divFourth = fourth;
}
function returnInfoForPaint(top, element) {
    this.top = top;
    this.element = element;
}

function insertAfter(elem, refElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(elem, next);
    } else {
        return parent.appendChild(elem);
    }
}


function paintEvent(id, NewEvent1, part, position, width, partLongEvent)
{
    var divStartEvent = document.getElementById(id);
    var newDiv = document.createElement("div");
    //newDiv.style.top = top + "px";
    var Classes = "DivEvent "+ NewEvent1.idEvent + "IdEvent";
    if (part == 2)
    {
        Classes += " EventEnd";
    }
    //newDiv.setAttribute("class", "DivEvent");
    newDiv.setAttribute("class", Classes);
    var find = id + "Day" + position ;
    newDiv.setAttribute("id", find);
    newDiv.setAttribute("data-position", String(position));
    //newDiv.classList.add(String(NewEvent1.idEvent));
    newDiv.innerHTML = NewEvent1.name + " "+ position;
    newDiv.style.width = width + "px";
    var top = position*22;
    newDiv.style.top = top + "px";
    divStartEvent.appendChild(newDiv);
    if(partLongEvent != 0) {
        if (part == 3 && partLongEvent == EventMoreThanMonthPart.StartLongEvent)
        {
            part = 0;
        }
        if (part == 3 && partLongEvent == EventMoreThanMonthPart.EndLongEvent)
        {
            part = 2;
        }
        if ((part == 0 && partLongEvent != EventMoreThanMonthPart.StartLongEvent) ||
            (part == 2 && partLongEvent != EventMoreThanMonthPart.EndLongEvent)) {
            return;
        }
    }
    if(part == 0) //начало
    {
        newDiv.style.borderTopLeftRadius = 6 + "px";
        newDiv.style.borderBottomLeftRadius = 6 + "px";
    }
    if(part == 2) //конец
    {
        newDiv.style.borderBottomRightRadius = 6 + "px";
        newDiv.style.borderTopRightRadius = 6 + "px";
    }
    if (part == 1) //середина
    {

    }
    if (part == 3) //отдельно стоящее в неделе событие
    {
        newDiv.style.borderTopLeftRadius = 6 + "px";
        newDiv.style.borderBottomLeftRadius = 6 + "px";
        newDiv.style.borderBottomRightRadius = 6 + "px";
        newDiv.style.borderTopRightRadius = 6 + "px";
    }
}
//var currentStartDate;
//var currentEndDate;

var EventMoreThanMonthPart = {
    StartLongEvent: 1,
    MiddleLongEvent : 2,
    EndLongEvent : 3,
}

function addEventToCalendar(NewEvent1, clone){

    var FullDateStart = new Date( NewEvent1.dateStart.valueOf());
    var FullDateEnd = new Date( NewEvent1.dateEnd.valueOf());
    var day; //получить начало события
    var dayEnd;//получить конец события
    var firstEnd = -1; //перекликается с частью
    var part = -1;//часть
    var partLongEvent = 0; //часть события которое длится больше месяца
    var x = FullDateStart; //день, с которого начинаетс див, к которому будут прибавляться дни события
    //событие находится внутри месяца
    if(currentStartDate <= FullDateStart && FullDateEnd < currentEndDate) {
        day = FullDateStart.getDate(); //получить начало события
        dayEnd = FullDateEnd.getDate();//получить конец события
        firstEnd = -1;
        part = -1;
    }
    //если событие начинается до текущего месяца и заканчивается в текущем
    if(FullDateStart < currentStartDate &&(currentStartDate <= FullDateEnd && FullDateEnd < currentEndDate))
    {
          day = currentStartDate.getDate(); //получить начало события - c начала месяца
          x = new Date(currentStartDate);
          dayEnd = FullDateEnd.getDate();//получить конец события - конец события в текущем месяце
          part = 1; //начинается с серидины.....
          partLongEvent = EventMoreThanMonthPart.EndLongEvent;
    }
    //если событие начинается до текущего месяца и заканчивается после текущего месяца
    if(FullDateStart < currentStartDate && FullDateEnd >= currentEndDate)
    {
        day = currentStartDate.getDate(); //получить начало события - c начала месяца
        x = new Date(currentStartDate);
        var DayMounthEnd = new Date(currentEndDate);
        DayMounthEnd.setDate(DayMounthEnd.getDate() - 1);
        dayEnd =  DayMounthEnd.getDate();//получить конец события - конец месяца
        part = 1; //тут могут быть ошибки
        partLongEvent = EventMoreThanMonthPart.MiddleLongEvent;
    }
    //если событие начинается в текущем месяце и заканчивается после текущего месяца
    if(FullDateStart >= currentStartDate && FullDateEnd >= currentEndDate)
    {
        day = FullDateStart.getDate(); //получить начало события
        var DayMounthEnd = new Date(currentEndDate);
        DayMounthEnd.setDate(DayMounthEnd.getDate() - 1);
        dayEnd =  DayMounthEnd.getDate();//получить конец события - конец месяца
        part = 1; //тут могут быть ошибки
        partLongEvent = EventMoreThanMonthPart.StartLongEvent;
    }
    //если событие начинается и заканчивается до текущего месяца и начинается и заканчивается после текущего месяца
    if((FullDateEnd < currentStartDate)|| FullDateStart >= currentEndDate)
    {
        return;
    }
    if(!clone) {
        var position = checkFreePlace(day, dayEnd, 0); //проверить свободное место
        setPositionForDay(day, dayEnd, position, NewEvent1.idEvent); //зарезервировать место под событие (заполнить этажи)
    }
        var width = 0; //ширина будущего дива
        var boolEnd = false;
        var currentday = day; //первый день дива
        if (day) { //если первый день дива есть
            for (var i = day; i <= dayEnd; i++) {//запоминаем, что в этом дне есть это событие
                                                //если позиция 5 - то создать див more
                if(!clone) {
                    setEventforOneDay(i, NewEvent1, position);
                }
            }
            if (position == 5) { //если позиция 5, то все что нужно выполнилось выше и рисовать див не нужно
                return;
            }
            if (day == dayEnd) {//если событие -лдин день, то его можно сразу нарисовать в календаре
                firstEnd = 3; //одна часть
                paintEvent(day, NewEvent1, firstEnd, position, 148,partLongEvent);
            }
            else { //если событие не состоит из одного дня
                for (var i = day; i <= dayEnd; i++) { //идти от дня-начала прорисовки события  до дня-конца
                    width += 149; //с каждым шагом прибавлять ширину( с каждым днем)
                    if (x.getDay() == 0) { // проверять если конец недели
                        if (x.getDate() != dayEnd) { //если конец недели и конец недели не равен концу события
                            if (firstEnd == -1) { //событие отрисовывалось?? -1 - нет , это будет начало события
                                part = 0; // начало
                                width += (width / 149 - 2);
                            }
                            if (firstEnd == 0 || firstEnd == 1) {//если нарисовано начало или нарисована середина и событие еще не закончилось
                                part = 1; // середина
                                width += (width / 149 - 2);
                            }
                        }
                        else { //если конец недели равен концу события
                            if (firstEnd == -1) { //если событие еще не отрисовывалось - то событие состоит из одного дива
                                part = 3; //заканчивается на конце недели - состоит из одного дива
                                width += (width / 149 - 2);
                            }
                            else { //если событие отрисовывалось, то значит надо дорисовать конец
                                part = 2; // конец
                                width += (width / 149 - 2);
                            }
                        }
                        paintEvent(currentday, NewEvent1, part, position, width, partLongEvent); //нарисовать див - конец недели
                        firstEnd = part;
                        width = 0;
                        boolEnd = true;
                        currentday = i + 1; //нарисовать от текущего дня, сделующий див с понедельника
                    }
                    x.setDate(x.getDate() + 1);
                } //прошли до конца
                if (part != 3 && part != 2) {//если не нарисовали целое событие и не отрисовали конец
                    if (!boolEnd) { //событие заканчивается в середине недели - все событие на одной недели и состоит из одного дива
                        width += (width / 149 - 2);
                        firstEnd = 3;
                        paintEvent(day, NewEvent1, firstEnd, position, width, partLongEvent);
                    }
                    else {//часть была отрисована, осталось нарисовать конец
                        width += (width / 149 - 2);
                        firstEnd = 2;
                        paintEvent(currentday, NewEvent1, firstEnd, position, width, partLongEvent);
                    }
                }
            }
        }
}
//localStorage.clear();
findEventsInLocalStorage();

var formMyFilds = document.forms.myform;
formMyFilds[0].focus();
function addInStorage() {
    var myform   = $( ".form-control");
    var invalidFild = false;
  for (i=0;i<myform.length; i++)
  {
      if(myform[i].value == 0)
      {
          invalidFild = true;
          myform[i].focus();
          event.preventDefault();
          var html = 'Есть пустые поля, их необходимо заполнить';
          $('#dialog-message').html(html);
          $( function() {
              $( "#dialog-message" ).dialog({
                  title: 'Ошибка!',
                  modal: true,
                  buttons: {
                      Ok: function() {
                          $( this ).dialog( "close" );
                      }
                  }

              });
          } );
          break;
      }
  }
   if(!invalidFild) {
        if(formMyFilds.dateStart.value > formMyFilds.dateEnd.value)
        {
            event.preventDefault();
            var html = 'Дата начала события не может быть позже даты окончания события!';
            $('#dialog-message').html(html);
            $( function() {
                $( "#dialog-message" ).dialog({
                    title: 'Ошибка!',
                    modal: true,
                    buttons: {
                        Ok: function() {
                            $( this ).dialog( "close" );
                        }
                    }

                });
            } );
            formMyFilds[0].focus();
            return;
        }
        document.getElementById("formInput").style.display = "none";
        document.getElementById("bigDiv").style.display = "none";

        var returnObj = JSON.parse(localStorage.getItem("event"));
        var idEvent = JSON.parse(localStorage.getItem("idEvent"));
        if (returnObj == null) {
            returnObj = [];
        }
        if(idEvent == null){
            idEvent = 1;
        }
       var NewEvent1 = new EventObj(
           formMyFilds.dateStart.value,
           formMyFilds.dateEnd.value,
           formMyFilds.name.value,
           formMyFilds.description.value,
           idEvent);
        idEvent++;
        returnObj.push(NewEvent1);
        var serialObj = JSON.stringify(returnObj);
        var serialEventId = JSON.stringify(idEvent);
        localStorage.setItem("event", serialObj);
        localStorage.setItem("idEvent", serialEventId);
        var bebe = JSON.parse(localStorage.getItem("idEvent"));
        var html = '';
        event.preventDefault();
        $('#dialog-message').html(html);
        $( function() {
            $( "#dialog-message" ).dialog({
                title: 'Событие создано!',
                modal: true,
                buttons: {
                    Ok: function() {
                        $( this ).dialog( "close" );
                        location.reload(false);
                    }
                }

            });
        } );
        //addEventToCalendar(NewEvent1);
    }
}

function deleteFromStorage() {
    localStorage.clear();
    var html = '';
    $('#dialog-message').html(html);
    $( function() {
        $( "#dialog-message" ).dialog({
            title: 'Очищен local Storage!',
            modal: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                    location.reload(false);
                }
            }

        });
    } );
}

function showForm() {
 $("#formInput").show();
 var bigDiv =  $("#bigDiv");
 bigDiv.width(document.documentElement.scrollWidth);
 bigDiv.height(document.documentElement.scrollHeight);
 bigDiv.offset({top:0});
 bigDiv.show();
}
function ShowAllEvent(event) {
    var id = this.getAttribute("id");
    var reg = /\d+/;
    id  = id.match(reg)[0];
    var html = '';
    for (var i =0; i < arrayOfDayInMounts[id].events.length; i++)
    {
        var ob = arrayOfDayInMounts[id].events[i];
        html += ob.name + "<br>";
    }
    $('#dialog-message').html(html);
    $( function() {
        $( "#dialog-message" ).dialog({
            title: 'Все события дня',
            modal: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }

        });
    } );
}

function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}
function findEventByClassDiv(elem) {
    for(var i=0; i<arrayOfevent.length;i++)
    {
        if(elem.hasClass(arrayOfevent[i].idEvent + "IdEvent"))
        {
            return arrayOfevent[i];
        }
    }
}

function findEventAndDelete(Event) {
    for(var i=0; i<arrayOfevent.length;i++)
    {
        if(arrayOfevent[i] == Event)
        {
            arrayOfevent.splice(i, 1);
            break;
        }
    }
    var serialEvents = JSON.stringify(arrayOfevent);
    localStorage.setItem("event", serialEvents);
}


var hoverDayDiv = [];
var countLeft = 0;
var countRight = 0;
var oldIndex = 0;
var x = 0;
var y = 0;



function findCurrentlyDivDay(x,y) {
    var CurrentlyDiv = 0;
    var arrayDayDiv = document.getElementsByClassName("day");
    for (var i = 0; i<arrayDayDiv.length; i++)
    {
        var coord2 = getCoords(arrayDayDiv[i]);
        if(coord2.top < y && y < (coord2.top + 111) &&
            coord2.left < x && x < (coord2.left + 150))
        {
            CurrentlyDiv = arrayDayDiv[i];
            return i;
        }
    }
}

var OldCurrentlyMouseDay = null;

$(".EventEnd")
    .resizable({
        handles:"e",
        containment:"#calendar",
        zIndex:120,
        autoHide: true,

        resize: function(event, ui) {
            var DivEvent = $(this);
            var yEvent = $(this).offset().top;
            var xEvent = $(this).offset().left;
            var DayDiv = 0;
            var Event = findEventByClassDiv($(this));
            var classNameEvent =  Event.idEvent + "IdEvent";
            var divEvents = document.getElementsByClassName(classNameEvent);
            var arrayDayDiv = document.getElementsByClassName("day");
            for (var i = 0; i<arrayDayDiv.length; i++)
            {
                var coord = getCoords(arrayDayDiv[i]);
                if(coord.top < yEvent && yEvent < (coord.top + 111) &&
                    coord.left < xEvent && xEvent < (coord.left + 150))
                {
                    DayDiv = arrayDayDiv[i];
                    break;
                }
            }
            $('#calendar').mousemove(function(event){
                x = event.clientX;
                y = event.clientY;
                var index = findCurrentlyDivDay(x,y);
                if(index != undefined)
                {
                    oldIndex = index;
                }
                var CurrentlyDiv = arrayDayDiv[oldIndex];
                var EventDateStart = new Date(Event.dateStart);
                EventDateStart.setHours(0,0,0,0);
                var CurrentlyMouseDay = new Date(currentDate.getFullYear(),currentDate.getMonth(), CurrentlyDiv.id);
                var diff = Math.floor((CurrentlyMouseDay.getTime() - EventDateStart.getTime()) / 24 / 60 / 60 / 1000);
                console.log(diff);
                console.log("текущая дата",CurrentlyMouseDay);
                if(hoverDayDiv.length != 0)
                {
                    for(var k = 0; k <hoverDayDiv.length; k++)
                    {
                        hoverDayDiv[k].style.backgroundColor = "#ffffff";
                    }
                }
                hoverDayDiv.splice(0,hoverDayDiv.length);
                for(var k = 0;  k <= diff; k++)
                {
                    if(arrayDayDiv[index - k] != undefined) {
                        hoverDayDiv.push(arrayDayDiv[index - k]);
                        arrayDayDiv[index - k].style.backgroundColor = "#dde6f6";
                    }
                }
                //arrayHideShowDivEvents = divEvents.slice();
                for (var c = 0; c < divEvents.length; c++)
                {
                    divEvents[c].style.display = "none";
                }
                var cloneEvent = {}; // новый пустой объект


                if(OldCurrentlyMouseDay != null)
                {
                    if(OldCurrentlyMouseDay != CurrentlyMouseDay)
                    {
                        var cloneClassNameEvent = 0 + "IdEvent";
                        var cloneDivEvents = document.getElementsByClassName(cloneClassNameEvent);
                        for (var key in Event) {
                            cloneEvent[key] = Event[key];
                        }
                        for (var c = 0; c < cloneDivEvents.length; c++)
                        {
                            cloneDivEvents[c].style.display = "none";
                        }
                        cloneEvent.dateEnd = CurrentlyMouseDay;
                        addEventToCalendar(cloneEvent, true);
                        OldCurrentlyMouseDay = new Date (CurrentlyMouseDay);
                    }
                }
                else
                {
                    for (var key in Event) {
                        cloneEvent[key] = Event[key];
                    }
                    OldCurrentlyMouseDay = new Date (CurrentlyMouseDay);
                    cloneEvent.dateEnd = CurrentlyMouseDay;
                    cloneEvent.idEvent = 0;
                    addEventToCalendar(cloneEvent, true);
                }
            });
        },
        stop: function(event, ui) {
            $('#calendar').unbind('mousemove');
            var Event = findEventByClassDiv($(this));
            var end = new Date(Event.dateEnd);
            var dEnd = new Date(OldCurrentlyMouseDay);
            Event.dateEnd = dEnd;
            var serialEvents = JSON.stringify(arrayOfevent);
            localStorage.setItem("event", serialEvents);
            location.reload(true);
        }
    })

$(".DivEvent")
    .draggable({
        zIndex:107,
        start: function(event, ui) {
            var y = ui.offset.top;
            var x = ui.offset.left;
            var coord = 0;
            var arrayDayDiv = document.getElementsByClassName("day");
            var Event = findEventByClassDiv($(this));
            for (var i = 0; i<arrayDayDiv.length; i++)
            {
                coord = getCoords(arrayDayDiv[i]);
                if(coord.top < y && y < (coord.top + 111) &&
                    coord.left < x && x < (coord.left + 150))
                {
                    //текущая дата - дата на текущем диве
                    var currentDivDate =  new Date(currentStartDate.getFullYear(),currentStartDate.getMonth(), arrayDayDiv[i].id);
                    var currentDivDatePrev = new Date(currentDivDate);
                    var currentDivDateNext = new Date(currentDivDate);
                    //исключим из подсчета текущий див
                    currentDivDatePrev.setDate(currentDivDatePrev.getDate()-1);
                    currentDivDateNext.setDate(currentDivDateNext.getDate()+1);
                    var EventDateStart = new Date(Event.dateStart);
                    var EventDateEnd = new Date(Event.dateEnd);
                    for(var k = new Date( currentDivDatePrev), b = 0; (k >= EventDateStart) ; (k.setDate(k.getDate() - 1)), b++)
                    {
                        countLeft++;
                    }
                    for(var k = new Date(currentDivDateNext), b = 0; (k <= EventDateEnd) ; (k.setDate(k.getDate() + 1)), b++)
                    {
                        countRight++;
                    }
                }
            }
        },
        drag: function(event, ui) {
            var y = ui.offset.top;
            var x = ui.offset.left;
            ui.position.left;
            ui.position.top;
            //var widthElement = $( this ).width();
            //var parts = widthElement/149;
            var coord = 0;
            var arrayDayDiv = document.getElementsByClassName("day");
            var Event = findEventByClassDiv($(this));

            if(!(coord.top > y || y < (coord.top + 111) &&
                coord.left < x && x < (coord.left + 150)) && hoverDayDiv.length!= 0)
            {
                for(var k = 0; k <hoverDayDiv.length; k++)
                {
                    hoverDayDiv[k].style.backgroundColor = "#ffffff";
                }
                console.log (hoverDayDiv);
            }
            hoverDayDiv.splice(0,hoverDayDiv.length);
            for (var i = 0; i<arrayDayDiv.length; i++)
            {
                coord = getCoords(arrayDayDiv[i]);
                //height: 111px;
                //width: 150px;
                if(coord.top < y && y < (coord.top + 111) &&
                    coord.left < x && x < (coord.left + 150))
                {
                    //затемнили текущий див
                    hoverDayDiv.push(arrayDayDiv[i]);
                    arrayDayDiv[i].style.backgroundColor = "#dde6f6";
                    for(var k = 1;  k <= countRight ; k++)
                    {
                        if(arrayDayDiv[i+k] != undefined) {
                            hoverDayDiv.push(arrayDayDiv[i + k]);
                            arrayDayDiv[i + k].style.backgroundColor = "#dde6f6";
                        }
                    }
                    for(var k = 1; k <= countLeft ; k++)
                    {
                        if(arrayDayDiv[i - k] != undefined) {
                            hoverDayDiv.push(arrayDayDiv[i - k]);
                            arrayDayDiv[i - k].style.backgroundColor = "#dde6f6";
                        }
                    }
                    break;
                }
            }
        },
        stop: function (event, ui) {
            for(var k = 0; k <hoverDayDiv.length; k++)
            {
                hoverDayDiv[k].style.backgroundColor = "#ffffff";
            }
            var y = ui.offset.top;
            var x = ui.offset.left;
            var coord = 0;
            var arrayDayDiv = document.getElementsByClassName("day");
            var findStopDiv = 0;
            var Event = findEventByClassDiv($(this));
            for (var i = 0; i<arrayDayDiv.length; i++)
            {
                coord = getCoords(arrayDayDiv[i]);
                //height: 111px;
                //width: 150px;
                if(coord.top < y && y < (coord.top + 111) &&
                    coord.left < x && x < (coord.left + 150))
                {
                    findStopDiv = arrayDayDiv[i];
                    break;
                }
            }
            if (findStopDiv != 0) {
                var d = new Date(currentDate.getFullYear(), currentDate.getMonth(), findStopDiv.id);
                var end = new Date(d);
                var start = new Date(d);
                end.setDate(end.getDate()+ countRight);
                start.setDate(start.getDate() - countLeft);
                Event.dateStart = start;
                Event.dateEnd = end;
                var serialEvents = JSON.stringify(arrayOfevent);
                localStorage.setItem("event", serialEvents);
                location.reload(true);
            }
            else
            {
                location.reload(true);
            }
    }
    });

$(".day").droppable({
});

function readLocalStorageCalendar() {
    var date = JSON.parse(localStorage.getItem("CalendarDate"));
    if (date === null) {
        var now = new Date();
        currentDate = new Date();
        currentDate = now;
    }
    else
    {
        currentDate = new Date(date);
    }
    createCalendar("calendar",  currentDate.getFullYear(), currentDate.getMonth());
    var stringifyDate = JSON.stringify(currentDate);
    localStorage.setItem("CalendarDate", stringifyDate);
}
function monthPrev() {
    currentDate = currentDate.setMonth(currentDate.getMonth()-1);
    var stringifyDate = JSON.stringify(currentDate);
    localStorage.setItem("CalendarDate", stringifyDate);
    location.reload(true);
}
function monthNext() {
    currentDate = currentDate.setMonth(currentDate.getMonth()+1);
    var stringifyDate = JSON.stringify(currentDate);
    localStorage.setItem("CalendarDate", stringifyDate);
    location.reload(true);
}

$(".DivEvent").contextmenu(function() {
    event.preventDefault();
    var element = $(this);
    var html = "";
    var Event = findEventByClassDiv(element);
    html += "Название события: " + Event.name +"<br> Начало события: "+ formateDate(new Date(Event.dateStart)) + "<br>" + "Конец события: " + formateDate(new Date(Event.dateEnd)) + "<br>" + "Описание события: " + Event.description;
    $('#dialog-message').html(html);
    $( function() {
        $( "#dialog-message" ).dialog({
            title: "Хотите удалить событие?",
            resizable: false,
            modal: true,
            buttons: {
                "Да, удалить событие": function() {

                    findEventAndDelete(Event);
                    $( this ).dialog( "close" );
                    $( function() {
                        $( "#dialog-message" ).dialog({
                            title: 'Cобытие удалено',
                            modal: true,
                            buttons: {
                                Ok: function() {
                                    $( this ).dialog( "close" );
                                    location.reload(false);
                                }
                            }
                        });
                    } );
                },
                "Нет, отмена": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    } );
});
function formateDate(DateInfo) {
    var html = "";
    html += DateInfo.getDate() + "." + (DateInfo.getMonth() + 1) + "." + DateInfo.getFullYear();
    return html;
}
$(".DivEvent").click(function() {
    var element = $(this);
    var Event = findEventByClassDiv(element);
    var html = "";
    html += "Начало события: "+ formateDate(new Date(Event.dateStart)) + "<br>" + "Конец события: " + formateDate(new Date(Event.dateEnd)) + "<br>" + "Описание события: " + Event.description;
    $('#dialog-message').html(html);
    $( function() {
        $( "#dialog-message" ).dialog({
            title: Event.name,
            modal: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    } );
});
$("#buttonPlus").click(showForm);
$("#buttonMinus").click(deleteFromStorage);
$("#enter").click(addInStorage);
$(".MoreEvent").click(ShowAllEvent);
$("#prev").click(monthPrev);
$("#next").click(monthNext);
//$("#dialog-message").draggable();