class DateAdapInfo {

    // DateAdapInfo Class
    constructor (dateJSouWD) {
        //this.dateJS...
        //this.dateWD...
        if (DateAdapInfo.estUneDateJS(dateJSouWD)) {
            this.dateJS=dateJSouWD;
            this.dateWD=DateAdapInfo.versDateWeb(this.dateJS);
        } else {
            this.dateWD=dateJSouWD;
            this.dateJS=DateAdapInfo.versDateJS(this.dateWD);
        }
     }

    static estUneDateJS(pDate) {
        if ( (pDate instanceof Date) && (!isNaN(pDate)) && (pDate>0)) {
            return true;
        }
        return false;
    }

    static versDateWeb(pDateJS){
        return [
         pDateJS.getFullYear().toString().padStart(2, '0'),
         (pDateJS.getMonth() + 1).toString().padStart(2, '0'),
         pDateJS.getDate().toString().padStart(2, '0')
        ].join('');
    }

    static versDateJS(pDateWebDev) {
        return new Date(
          parseInt(pDateWebDev.substr(0,4),10),
          parseInt(pDateWebDev.substr(4,2),10)-1,
          parseInt(pDateWebDev.substr(6,2),10)
        );
    }

    static testUnitaire() {
        
        console.log("DateAI Testeur");
        let dateJS=new Date();
        console.log(" ");
        console.log("dateJS est une date ?",DateAdapInfo.estUneDateJS(dateJS));

        let dateAI=new DateAdapInfo(new Date());
        console.log(" ");
        console.log("Init DateAI avec newDate()");
        console.log("dateAI format WebDev=",dateAI.dateWD);
        console.log("dateAI format JS=",dateAI.dateJS);

        console.log(" ");
        console.log("Init DateAI avec 20221224");
        dateAI=new DateAdapInfo("20221224");
        console.log("dateAI format WebDev=",dateAI.dateWD);
        console.log("dateAI format JS=",dateAI.dateJS);
    }

}

class Calendrier
{
    // Calendrier Class
    constructor(numero,date,plageselection,tblData)
    {
        this.spectaclesDates=[];
        this.numero = numero;
        this.date = date ;
        this.n1 = -1;
        this.n2 = -1;
        this.selectionEnCours = false;
        this.dernierNo = -1; 
        this.plageselection = plageselection;
        this.calendrier = this.generateTab(numero,date);
        let boolplageselection = this.plageselection;
        const tobjCal = this; 
        this.observers =[];
        this.derniereCaseTouchMove;

        let moisPrec = document.querySelector('.moisPrec');
        document.addEventListener('click',(event)=>{

            if((event.target.getAttribute('class')) && (event.target.getAttribute('class').search('moisPrec') >= 0))
            {
                
                let jour = "1";
                let currentDate = new Date();
                let nouvelleDate = new Date(this.date.getFullYear(),this.date.getMonth()-1,jour);

                if(nouvelleDate.getTime()<currentDate.getTime())
                {
                    nouvelleDate = currentDate;
                }

                this.date = nouvelleDate;
                this.dateRecalcule(nouvelleDate);
                let evtPeriode={
                    evtSrc : event,
                    event : "dateAChangé",
                    date : nouvelleDate,
                    mois : "precedent",
                };
                this.fire(evtPeriode);
            }
            

        })
        document.addEventListener('click',(event)=>{
            if((event.target.getAttribute('class')) && (event.target.getAttribute('class').search('moisSuiv') >= 0))
            {
                let jour = "1";
                let nouvelleDate = new Date(this.date.getFullYear(),this.date.getMonth()+1,jour);
                this.date = nouvelleDate;
                this.dateRecalcule(nouvelleDate);

                let evtPeriode={
                    evtSrc : event,
                    event : "dateAChangé",
                    date : nouvelleDate,
                    mois : "suivant"
                };
                this.fire(evtPeriode);
            }
        });

        window.addEventListener('mouseup',function(event){
            let evtPeriode={
                 evtSrc : event,
                 event : "selectFin",
                 no    :  0
             };
            tobjCal.fire(evtPeriode);
        });

        document.addEventListener('mouseover',function(evt){
            if((evt.target.getAttribute('class')) && (evt.target.getAttribute('class').search('case') >= 0))
            {
                if(boolplageselection)
                {
                    let evtPeriode={
                        evtSrc : evt,
                        event : "mouseHover",
                        no    :  parseInt(evt.target.getAttribute("no"),10),
                        cal    :  parseInt(evt.target.getAttribute("numCal"),10)
                    };
                    tobjCal.fire(evtPeriode);
                }
            }

        })

        document.addEventListener('mouseup',function(evt)
        {
            if((evt.target.getAttribute('class')) && (evt.target.getAttribute('class').search('case') >= 0))
            {
                let evtPeriode={
                    evtSrc : evt,
                    event : "mouseUp",
                    no    :  parseInt(evt.target.getAttribute("no"),10),
                    cal    :  parseInt(evt.target.getAttribute("numCal"),10)
                };

                tobjCal.fire(evtPeriode);
                return;
            }
        })

        document.addEventListener('touchend',function(evt)
        {
            if((evt.target.getAttribute('class')) && (evt.target.getAttribute('class').search('case') >= 0))
            {
                let evtPeriode={
                    evtSrc : evt,
                    event : "mouseUp",
                    no    :  parseInt(evt.target.getAttribute("no"),10),
                    cal    :  parseInt(evt.target.getAttribute("numCal"),10)
                };

                tobjCal.fire(evtPeriode);
                return;
            } 
            
        })

        document.addEventListener('mousedown',function(evt)
        {
            if((evt.target.getAttribute('class')) && (evt.target.getAttribute('class').search('case') >= 0) && (tobjCal.numero == evt.target.getAttribute("numCal")))
            {

                let evtPeriode;
                if(evt.type == "mousedown")
                {
                    evtPeriode={
                        evtSrc : evt,
                        event : "mouseDown",
                        no    :  parseInt(evt.target.getAttribute("no"),10),
                        cal    :  parseInt(evt.target.getAttribute("numcal"),10)
                    };
                    tobjCal.fire(evtPeriode);

                    return;
                }   
            }         
        })

        document.addEventListener('touchstart',function(evt){
        
            if((evt.target.getAttribute('class')) && (evt.target.getAttribute('class').search('case') >= 0))
            {
                // @TODO  $(".btn_active").toggleClass('btn_active',false);
                let evtPeriode={
                     evtSrc : evt,
                     event : "mouseDown",
                     no    :  parseInt(evt.target.getAttribute("no"),10),
                     cal : parseInt(evt.target.getAttribute("numCal"),10)
                 };
                 let clientX = evt.touches[0].clientX;
                 let clientY = evt.touches[0].clientY;
                this.derniereCaseTouchMove = document.elementFromPoint(clientX, clientY);
                tobjCal.fire(evtPeriode); 
            }

        })
       
        document.addEventListener("touchmove",(evt)=>{

            if((evt.target.getAttribute('class')) && (evt.target.getAttribute('class').search('case') >= 0))
            {
                let clientX = evt.touches[0].clientX;
                let clientY = evt.touches[0].clientY;
                let caseTouchMove = document.elementFromPoint(clientX, clientY);
                let parent = caseTouchMove.parentNode
                if(caseTouchMove.getAttribute("data-name" == "heureRpr"))
                {
                    caseTouchMove = caseTouchMove.parentNode;
                }
            
                if((this.derniereCaseTouchMove != caseTouchMove))
                {
                    this.derniereCaseTouchMove = caseTouchMove;
                    let evtPeriode={
                        evtSrc : evt,
                        event : "mouseHover",
                        no    :  parseInt(caseTouchMove.getAttribute("no"),10),
                        cal : parseInt(caseTouchMove.getAttribute("numCal"),10)
                    };

                    if(!isNaN(evtPeriode.no) && (this.plageselection))
                    {
                        tobjCal.fire(evtPeriode);
                    }
                }
            }
        })
    }
    
    // Calendrier Class
    generateTab(numero,dateCal)
    {
        let cpt = 0;
        let tabMois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
        this.date = dateCal ;
        let firstDay = this.getFirstDayMonth();
        let nbjours = this.getNbJours();
        let calendrierJours ="";
        let dateYear = dateCal.getFullYear();
        let dateMonth = dateCal.getMonth()+1;
        let dateDay = dateCal.getDate();
        let calendrierEntete = "<table data-calendrierNo="+numero+" data-calMois="+dateMonth+" data-calYear="+dateYear+"><thead><tr><th colspan='1' class='moisPrec' ><i class='fa-solid fa-angles-left moisPrec'></i></th><th colspan='5'>"+tabMois[dateMonth-1]+" - "+dateCal.getFullYear()+"</th><th colspan='1'  class='moisSuiv'><i class='fa-solid fa-angles-right moisSuiv'></i></th></tr><tr><th>lun</th><th>mar</th><th>mer</th><th>jeu</th><th>ven</th><th>sam</th><th>dim</th></tr></thead>";
        let calendrierRows =calendrierEntete+"<tr>";
        let moisPrecedent = dateMonth -1;
        if(moisPrecedent<=0){
            moisPrecedent = 12;
        }
        let nbjoursmoisprecedent = nbjours[moisPrecedent-1];
        let jour = 0 ; 
        let jouravant = 0;

        for(let i=firstDay;i>0;i--)
        {
            jouravant++;
        }

        for(let i=0;i<jouravant;i++)
        {
            if((cpt%7 == 0) && (cpt !=0))
            {
                calendrierRows += calendrierJours+"</tr><tr>";
                calendrierJours ="";
            }
            let indiceAnnee = 0;
            
            if(moisPrecedent==12)
            {
                indiceAnnee = 1;
            }

            let tmpDate=new Date((dateYear-indiceAnnee),moisPrecedent-1,(nbjoursmoisprecedent-jour));
            let tmpDateWD=DateAdapInfo.versDateWeb(tmpDate);           
            calendrierJours = `<td class="case day_before"  data-datewd="${tmpDateWD}" no="${(jouravant-1-i)}" numCal="${this.numero}">${(nbjoursmoisprecedent-jour)}</td>`+calendrierJours;
            jour++;
            cpt++;
        }
        
        let calendrierJourMoisPrec = calendrierJours;
        let joursPasses = this.getJoursPasses(this.date);
        for(let i=joursPasses.length;i>0;i--){
            if((cpt%7 == 0) && (cpt !=0))
            {
                calendrierRows += calendrierJours+"</tr><tr>";
                calendrierJours ="";
            }
            let tmpDate=new Date(dateYear,dateMonth-1,(dateDay-i));
            let tmpDateWD=DateAdapInfo.versDateWeb(tmpDate);
            calendrierJours += `<td class="case day_before"  data-datewd="${tmpDateWD}" no="${cpt}" numCal="${this.numero}">${(dateDay-i)}</td>`;
            cpt++;
        }

        jour = 0;

        for(let i=joursPasses.length;i<nbjours[this.date.getMonth()];i++){
            
            if((cpt%7 == 0) && (cpt !=0))
            {
                calendrierRows += calendrierJours+"</tr><tr>";
                calendrierJours ="";
            }
            let tmpDate=new Date(dateYear,dateMonth-1,(dateDay+jour));
            let tmpDateWD=DateAdapInfo.versDateWeb(tmpDate);
            calendrierJours += `<td class="case mois_courant" data-datewd="${tmpDateWD}" no="${cpt}" numCal="${this.numero}">${(i+1)}</td>`;
            cpt++;
            jour++;
        }
        let jourafter = 1
        for(let i=cpt;i%7 != 0 ; i++)
        {   
            let moisSuivant = dateMonth + 1;
            let year = dateYear;
            
            if(moisSuivant>12){ 
                moisSuivant = 1;
                year = dateYear+1;
            }
            let tmpDate=new Date(year,moisSuivant-1,(jourafter));
            let tmpDateWD=DateAdapInfo.versDateWeb(tmpDate);
            
            calendrierJours += `<td class="case day_after" data-name="day_after"  data-datewd="${tmpDateWD}" no="${cpt}" numCal="${this.numero}">${jourafter}</td>`;
            cpt++;
            jourafter++;
        }
        this.dernierNo = cpt-1;
        calendrierRows += calendrierJours+"</tr></table>";
        return calendrierRows;
    }
    
    // Calendrier Class
    getJoursPasses()
    {
        let tabJoursPasses =[];
        let currentDay = this.date.getDate();
        for(let i=1;i<currentDay;i++)
        {
            tabJoursPasses.push(i);
        }
        return tabJoursPasses;
    }

    // Calendrier Class
    getFirstDayMonth()
    {
        let date1 = new Date(this.date.getFullYear(),this.date.getMonth(),0);
        return date1.getDay();
    }

    // Calendrier Class
    getNbJours(){

        let tabnbjours=[];
        for(let i=-1;i<11;i++)
        {
            let month = (this.date.getMonth()+i)%12;
            let year = this.date.getFullYear()+Math.floor((this.date.getMonth()+i)/12);
            let nbjours = new Date(year,month+1,-1).getDate()+1;
            tabnbjours.splice(month,0,nbjours);
        }

        return tabnbjours; // tableau nombre de jours par mois
    }

    // Calendrier Class
    selectionne(n1,n2){ 
        
        if(n1<0){ n1 = 0; }
        if(n2<0){ n2 = this.dernierNo; }

        for(let i=n1;i<=n2;i++)
        {
            document.querySelectorAll('div[data-name="calendrier"][data-divcalendrierno="'+this.numero+'"] td')[i].classList.add('cal-selection');
        }
    }
    // Calendrier Class
    selectionneDate(date1,date2)
    {
        let dateCal1=this.dateWDDeCase(0);
        let dateCal2=this.dateWDDeCase(this.dernierNo);
        let dateCal1JS = DateAdapInfo.versDateJS(dateCal1);
        let dateCal2JS = DateAdapInfo.versDateJS(dateCal2);
        if(date2<dateCal1JS)
        {
            return;
        }
        if(date1>dateCal2JS)
        {
            return;
        }

        let n1=this.caseDate(date1);
        let n2=this.caseDate(date2);
        this.selectionne(n1,n2);

        let evtPeriode={ // xxxxxxxxxxxxxxxxxxxxxx
            event : "mouseUp",
            date1 : date1,
            date2 : date2 
        } 
        this.fire(evtPeriode);
    }

    caseDate(date)
    {
        let dateWD = DateAdapInfo.versDateWeb(date);
        let numero = -1;

        document.querySelectorAll("div[data-divcalendrierno='"+this.numero+"'] td").forEach(function(evt){
            if(evt.getAttribute("data-datewd") == dateWD )
            {
                numero = parseInt(evt.getAttribute("no"));
            } 
        });
        return numero
    }

    // Calendrier Class
    // appelée par le conteneur
    dateRecalcule(nouvelleDate) {

        this.date = nouvelleDate;
        let newDomJours = this.generateTab(this.numero,nouvelleDate);
        document.querySelector('div[data-divcalendrierno="'+this.numero+'"]>table').remove();
        document.querySelector('div[data-divcalendrierno="'+this.numero+'"]').insertAdjacentHTML('beforeend',newDomJours);

        let evtPeriode={
                  evtSrc : event,
                  event : "dateChange", 
                  nouvelleDate  :  nouvelleDate 
        };
        this.fire(evtPeriode);
    }

    // Calendrier Class
    casesJourAjour(date1,date2) {

        let noMin =-1 , noMax = -1;
        let dateAI1=new DateAdapInfo(date1);
        let dateAI2=new DateAdapInfo(date2);
        let cal = document.querySelectorAll('div[data-divcalendrierno="'+this.numero+'"]>table')[0];
        cal.querySelectorAll('td').each(function(evt) {
           let tmpDateWd = $(evt).attr('data-datewd');
           let no=parseInt($(evt).attr('no'),10);

           if ( (tmpDateWd>=dateAI1.dateWD) && (tmpDateWd<=dateAI2.dateWD) && (noMin==-1) ) { noMin=no; }
           if ( (tmpDateWd>=dateAI1.dateWD) && (tmpDateWd<=dateAI2.dateWD) ) { noMax=no; }
        });
        
        return{ no1:noMin , no2:noMax };
    }        

    // Calendrier Class
    supprimeSelection(){
        // $('div[data-name="calendrier"] td').removeClass('cal-selection');
        let cal = document.querySelectorAll('div[data-name="calendrier"] td').forEach(function(evt)
        {
            evt.classList.remove('cal-selection');
        });

    }

    // Calendrier Class
    getNumeroCalendrier(){
        return this.numCalendrier ;
    }

    getDateCal(){
        return this.date ;
    }

    // Calendrier Class
    dateWDDeCase(no)
    {
        let date = document.querySelectorAll('div[data-divcalendrierno="'+this.numero+'"] td')[no].getAttribute("data-datewd");
        return date;
    }

    // Calendrier Class
    subscribe(obj)
    {
        this.observers.push(obj);
    }

    // Calendrier Class
    unsubscribe(fn) {
        this.observers = this.observers.filter(
            function (item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    }

    // Calendrier Class
    fire(evt) {
        let thisCal = this;
        this.observers.forEach(function (item) {
            evt.numCal = thisCal.numero;
            evt.sender = thisCal;
            item.onCalendrierEvent(evt);
        });
    }
}

class Container{

    // Container Class
    constructor(date1,date2,boolContainerVisible,boolPlageSelection,tblData,chaDomPlace){

        let cal1 = new Calendrier(0,date1,boolPlageSelection,tblData);
        let cal2 = null;
        if(date2 != null)
        {
            cal2 = new Calendrier(1,date2,boolPlageSelection,tblData);
        }
        this.spectaclesDates=[];
        this.calendriers=[]
        this.calendriers.push(cal1);
        this.calendriers.push(cal2);
        this.tblData = tblData;
        this.boolPlageSelection = boolPlageSelection;
        this.chaDomPlace = chaDomPlace;
        this.calendriers[0].subscribe(this);
        if(this.calendriers[1] != null)
        {
            this.calendriers[1].subscribe(this);  
        }
        this.selectionEnCours = false;
        this.sel = [];
        this.sel.push({cal:-1,no:-1});
        this.sel.push({cal:-1,no:-1});
        this.thisContainer = this;
        this.dernierSelection = [];
        this.date1 = -1;
        this.date2 = -1;
        this.bouton = -1; // Pour le filtre
        this.boolClicCalendrier = false;
        // du container
        this.observers = [];
        this.boolContainerVisible = boolContainerVisible;
        
        this.domSelecteur();
        this.ajouteGestionFiltre();
        this.afficheHeureRepresentation(); // Afficher les heures envoyés dans le container

        document.addEventListener("mousedown",function(evt){
            if((evt.target.getAttribute('class')) && (evt.target.getAttribute("class").search("case")>=0))
            {
                this.boolClicCalendrier = true; 
                this.bouton = -1;
            }
        })

        document.addEventListener('click',(evt)=>{
            if((evt.target.getAttribute('data-name')) && (evt.target.getAttribute('data-name') == "heureRpr"))
            {
                document.querySelectorAll("td.cal-selection").forEach(function(evt)
                {
                    evt.classList.remove("cal-selection")
                });

                let evtPeriode = {
                    event : "ChoixSpectacle",
                    idRepr : evt.target.getAttribute('idrpr'),
                    date : evt.target.getAttribute('data-datewd')
                };
                this.fire(evtPeriode);
                this.supprimeDate();
                this.replier();
            }

        })

        window.addEventListener("mouseup",(evt)=>{
            
            if(this.boolClicCalendrier) // Vérification mousedown sur un calendrier au préalable
            {
                this.boolClicCalendrier = false;
                this.selectionEnCours = false;
                let caseDate = evt.target.getAttribute("data-datewd"); // On récupère le target du mouseup
                
                if(!caseDate) // Si l'élément n'est pas une case calendrier
                {
                    for(let i=0;i<this.calendriers.length;i++)
                    {
                        if(this.modeUnCalendrier())
                        {
                            this.calendriers[0].supprimeSelection();
                        }
                        else
                        {
                            this.calendriers[i].supprimeSelection();
                        }
                    }
                    let evtPeriode = {
                        event : "HorsCaseCalendrier",
                        date1 : -1,
                        date2 : -1
                    }  
                    this.fire(evtPeriode);  
                    this.supprimeDate();
                }
            }
        })
        
        let checkbox = document.querySelector('.checkbox');
        checkbox.checked = false;
        checkbox.addEventListener("change",()=>{
            this.boolActif = !this.boolActif; // Inverse booléen
            this.activer(this.boolActif); 
            this.sel = this.selectionTriée();
            let sel = false;
            let evt;
            if((this.sel[0].cal > -1 ) || (this.sel[1].cal > -1))
            {
                sel = true;
            }
            if(sel)
            {
                evt={
                    event : "Activation",
                    actif : this.boolActif,
                    date1 : this.calendriers[this.sel[0].cal ].dateWDDeCase(this.sel[0].no),
                    date2 : this.calendriers[this.sel[1].cal ].dateWDDeCase(this.sel[1].no) 
                } 
            }
            else
            {
                evt={
                    event : "Activation",
                    actif : this.boolActif,
                    date1 : -1,
                    date2 : -1 
                } 
            }
            this.fire(evt); // On prévient l'état actif ou non  
        })

        if(this.boolContainerVisible)
        {
            this.activer(this.boolContainerVisible);
            this.deplier();
        }
        else{
            this.activer(this.boolContainerVisible);
            this.replier();
        }

        document.querySelector(".icone-calendrier").addEventListener("click",()=>{
            if(this.boolContainerVisible==false)
            { 
                this.deplier();
            }
            else{
                this.replier();
            }
        })
    }
    // Container Class
    modeUnCalendrier()
    {
        return this.calendriers[1] == null ;
    }
    // Container Class
    domSelecteur()
    {
        let dom1 =`<div class="container-fluid" data-name='container'>
            <div class="row" data-name="row-calendrier">
            </div>
        </div>`;

        document.querySelector(this.chaDomPlace).insertAdjacentHTML('beforeend',dom1);

        let domC1 = `<div class='col-12 col-md-6 col-lg-4' data-name='calendrier' data-divCalendrierNo='0' >`+this.calendriers[0].calendrier+`</div>`;
        let domC2;
        if(this.calendriers[1] != null)
        {
            domC1 = `<div class='col-12 col-md-6 col-lg-4' data-name='calendrier' data-divCalendrierNo='0' >`+this.calendriers[0].calendrier+`</div>`;
            domC2 = `<div class='col-12 col-md-6 col-lg-4' data-name='calendrier' data-divCalendrierNo='1' >`+this.calendriers[1].calendrier+`</div>`;
        }
        else{
            domC1 = `<div class='col-12 col-md-12 col-lg-8' data-name='calendrier' data-divCalendrierNo='0' >`+this.calendriers[0].calendrier+`</div>`;
        }

        let domFiltre = `<div class='col-12 col-lg-4' data-name='legende-calendrier'><div class="row justify-content-around" data-name=boutons>`+this.filtre()+`</div></div>`;
        let domEntete = `<div class='col-12' data-name='enteteContainer'>`+this.entete()+`</div>`;
        let domDiv = document.querySelector('div[data-name="row-calendrier"]');
        domDiv.insertAdjacentHTML('beforeend',domEntete);
        domDiv.insertAdjacentHTML('beforeend',domFiltre);
        domDiv.insertAdjacentHTML('beforeend',domC1);
        if(domC2)
        {
            domDiv.insertAdjacentHTML('beforeend',domC2);
        }
        
        
        return dom1;
    }
    
    // Container Class
    affichageCalendrierNo(no){
        return this.calendriers[no];
    }
    entete()
    {
        return `<div class="row-selection">
                    <div class="dates">
                        <div class="btn-date1">date</div>
                        <div class="btn-date2"></div>
                    </div>
                    <div class="icones">
                        <label class="switch">
                            <input class="checkbox" type="checkbox">
                            <span class="slider round"></span>
                        </label>
                        <div class="icone-calendrier">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                    </div>
                </div>`;
    }
    // Container Class
    filtre()
    {
        return `<input class="col-5 col-sm-3 col-lg-12" type=submit data-calbtn="jourencours" value="Aujourd'hui" /><input class="col-5 col-sm-3 col-lg-12" type=submit data-calbtn="semaineencours" value="Cette semaine" /><input type=submit class="col-5 col-sm-3 col-lg-12" data-calbtn="joursprochains" value="3 prochains jours" /><input type=submit class="col-5 col-sm-3 col-lg-12" data-calbtn="weekendprochain" value="Le weekend prochain" /><input type=submit class="col-5 col-sm-3 col-lg-12" data-calbtn="moisencours" value="Ce mois" />`;
    }
    // Container Class
    caseDate(date)
    {
        let dateWD = DateAdapInfo.versDateWeb(date);
        let calendrier;
        let numero = -1;

        for(let i=0;i<this.calendriers.length;i++)
        {
            document.querySelectorAll("div[data-divcalendrierno='"+i+"'] td").forEach(function(evt){
                if(evt.getAttribute("data-datewd") == dateWD )
                {
                    calendrier = i;
                    numero = parseInt(evt.getAttribute("no"));
                }
            })
        }
        return {cal: calendrier, no: numero}
    }

    // Container class
    activer(boolContainer)
    {
        // let bouton = $('input.btn_active');
        let bouton = document.querySelector(".btn_active");
        
        if(bouton) // On vérifie que l'objet jquery ne soit pas vide
        {
            this.bouton = bouton;
        }

        if(boolContainer == false) // Switch à off
        {
            for(let i=0;i<this.calendriers.length;i++) // Supprime selection
            {
                if(this.modeUnCalendrier())
                {
                    this.calendriers[0].supprimeSelection();
                }
                else
                {
                    this.calendriers[i].supprimeSelection();
                }
            }
            if(document.querySelector(".btn_active"))
            {
                document.querySelector(".btn_active").classList.remove("btn_active")
            }
            
            document.querySelector(".btn-date1").style.visibility = "hidden";
            document.querySelector(".btn-date2").style.visibility = "hidden";
        }
        else{ // switch à entête à on
            if(this.bouton != -1)
            {
                this.bouton.classList.add("btn_active");
            }
            
            $(this.bouton).toggleClass('btn_active',true); // Supprime le btn active pour l'actualiser
            if(document.querySelector(".btn-date1").innerHTML != "date") // vérifier qu'une date a été choisi pour rendre les champs visible
            {
                document.querySelector(".btn-date1").style.visibility = "visible";
                document.querySelector(".btn-date2").style.visibility = "visible";
            }

            if(this.sel[0].cal != -1) // On vérifie si y a eu une saisie
            {
                let tmpSel = this.sel ;

                if (tmpSel[0].cal==tmpSel[1].cal) { // Sélection sur un seul calendrier
                    this.calendriers[tmpSel[0].cal].selectionne(tmpSel[0].no,tmpSel[1].no);
        
                } 
                else{ // sélection à cheval sur 2 calendrier
                    this.calendriers[tmpSel[0].cal].selectionne ( tmpSel[0].no , -1);
                    this.calendriers[tmpSel[1].cal].selectionne (           -1 , tmpSel[1].no);
                }  
            } 
                       
        }
    }
    
    afficheHeureRepresentation()
    {
        for(let i=0;i<this.tblData.length;i++)
        {   
            if(!(Object.keys(this.tblData[i]).length === 0))
            {
                let dateRpr = this.tblData[i].date;
                let dateJS = DateAdapInfo.versDateJS(dateRpr);
                let nbRp = this.tblData[i].tblRpr.length;
                let caseDate = this.caseDate(dateJS);
                let caseJour = document.querySelector('td[no="'+caseDate.no+'"][numCal="'+caseDate.cal+'"]');
                let domHeure = ""
                for(let rpr = 0;rpr<nbRp;rpr++)
                {
                    let heureRpr = this.tblData[i].tblRpr[rpr].heure;
                    let idRpr = this.tblData[i].tblRpr[rpr].idRpr;
                    domHeure += '<div data-name=heureRpr cal='+caseDate.cal+' no='+caseDate.no+' data-datewd='+dateRpr+' idRpr='+idRpr+'>'+heureRpr+'</div>'
                }
                if(caseJour){
                    caseJour.classList.add("cal-spectacle");
                    caseJour.insertAdjacentHTML('beforeend',domHeure);
                }

            }    
        }
    }
    
    supprimeAffichageRepresentation(){
        for(let i=0;i<this.tblData.length;i++)
        {   
            if(!(Object.keys(this.tblData[i]).length === 0))
            {
                let dateRpr = this.tblData[i].date;
                let affiche = document.querySelector("td[data-datewd='"+dateRpr+"'] div");
            }    
        }
    }

    supprimeDate()
    {

        document.querySelector(".btn-date1").style.visibility = "hidden";
        document.querySelector(".btn-date1").innerHTML = "date";
        document.querySelector(".btn-date2").innerHTML = "date";
        document.querySelector(".btn-date2").style.display = "none";
    }
    afficheDatesEntete(date1JS,date2JS)
    {
        let affichageD1 = date1JS.getDate().toString().padStart(2, '0')+"/"+(date1JS.getMonth() + 1).toString().padStart(2, '0')+"/"+date1JS.getFullYear();
        let affichageD2 = date2JS.getDate().toString().padStart(2, '0')+"/"+(date2JS.getMonth() + 1).toString().padStart(2, '0')+"/"+date2JS.getFullYear();

        if(affichageD1 == affichageD2)
        {
            document.querySelector(".btn-date2").style.display = "none";
        }
        else
        {
            document.querySelector(".btn-date2").style.display = "block";
            document.querySelector(".btn-date2").style.visibility = "visible";
        }
        document.querySelector(".btn-date1").style.visibility = "visible";
        document.querySelector(".btn-date1").innerHTML = affichageD1;
        document.querySelector(".btn-date2").innerHTML = affichageD2;
    }

    // Container Class
    fctCalVal_cha(){
        let tabMoisCal = [];
        let dateCal;
        let dateCal1 = null;
        let dateCal2 = null;
        if(this.modeUnCalendrier())
        {
            dateCal = this.calendriers[0].getDateCal();
            tabMoisCal.push(dateCal)
        }
        else
        {
            for(let i=0;i<this.calendriers.length ; i++)
            {
                dateCal = this.calendriers[i].getDateCal();
                tabMoisCal.push(dateCal)
            }
        }

        if(tabMoisCal[0])
        {
            dateCal1 = DateAdapInfo.versDateWeb(tabMoisCal[0]);
        }
        if(tabMoisCal[1])
        {
            dateCal2 = DateAdapInfo.versDateWeb(tabMoisCal[1]);
        }
        let btnFiltre;

        if(document.querySelector(".btn_active"))
        {
            btnFiltre = document.querySelector(".btn_active").getAttribute("data-calbtn");
        }
        

        let dataContainer = {
            dateCal1 : dateCal1,
            dateCal2 : dateCal2,
            selection : this.boolPlageSelection,
            actif : this.boolContainerVisible,
            date1 : this.date1,
            date2 : this.date2,
            boutonfiltre : btnFiltre
        }
        return JSON.stringify(dataContainer);
    }

    pcdCalVal(data){


        let dataContainer = JSON.parse(data);
        this.boolContainerVisible=dataContainer.actif;
        if(this.boolContainerVisible)
        {
            this.deplier();
        }
        this.boolPlageSelection = dataContainer.selection;
        this.date1 = dataContainer.date1;
        this.date2 = dataContainer.date2;

        if(dataContainer.boutonfiltre)
        {
            document.querySelector("input[data-calbtn="+dataContainer.boutonfiltre+"]").classList.add("btn_active");
        }

        this.calendriers[0].dateRecalcule(DateAdapInfo.versDateJS(dataContainer.dateCal1));
        if(!this.modeUnCalendrier())
        {
            this.calendriers[1].dateRecalcule(DateAdapInfo.versDateJS(dataContainer.dateCal2));
        }
        this.afficheHeureRepresentation();
        
        for(let i=0;i<this.calendriers.length;i++)
        {
            if(this.modeUnCalendrier())
            {
                this.calendriers[0].selectionneDate(DateAdapInfo.versDateJS(dataContainer.date1),DateAdapInfo.versDateJS(dataContainer.date2));
            }
            else
            {
                this.calendriers[i].selectionneDate(DateAdapInfo.versDateJS(dataContainer.date1),DateAdapInfo.versDateJS(dataContainer.date2));
            }

        }
        this.afficheDatesEntete(DateAdapInfo.versDateJS(this.date1),DateAdapInfo.versDateJS(this.date2))
    }

    // Container Class
    onCalendrierEvent(evt){

        // Container Class
        if(evt.event == "mouseDown")
        {
            // un début de clic a eu lieu sur une case d'un des calendriers
            this.selectionEnCours = true;
            for(let i=0;i<this.calendriers.length;i++)
            {
                if(this.modeUnCalendrier())
                {
                    this.calendriers[0].supprimeSelection(); 
                }
                else
                {
                    this.calendriers[i].supprimeSelection();
                }
            }
            this.boolClicCalendrier = true;
            this.sel[0] = { cal:evt.numCal,no: evt.no};
            this.sel[1] = { cal:evt.numCal,no: evt.no};
            this.calendriers[evt.numCal].selectionne( evt.no, evt.no);
            this.date1 = this.calendriers[evt.numCal].dateWDDeCase(evt.no);
            this.date2 = this.date1;
            this.boolActif = true;
            document.querySelector(".checkbox").checked = this.boolActif;
            // $('.checkbox').prop("checked",this.boolActif);
            
            this.fire({
                event : "SelectionDebut",
                date1 : this.date1,
                date2 : this.date2,
            });

        }

        // Container Class
        if(evt.event == "mouseUp" && (this.selectionEnCours))
        {
            console.log("here");
            if(document.querySelector(".btn_active"))
            {
                document.querySelector(".btn_active").classList.remove("btn_active");
            }
            // $(".btn_active").toggleClass('btn_active',false); // Supprime le btn active si cliqué -- saisie manuelle
            let evtPeriode;

            if(evt.evtSrc.target.getAttribute("data-name")=="heureRpr")
            {
                return;
            }
            if(this.boolPlageSelection)
            {
                // on a relaché la souris d'une des cases d'un des calendriers
                this.selectionEnCours = false;
                this.sel = this.selectionTriée();
                this.dernierSelection = this.sel;
                evtPeriode={
                    event : "SelectionFaite",
                    date1 : this.calendriers[this.sel[0].cal ].dateWDDeCase(this.sel[0].no),
                    date2 : this.calendriers[this.sel[1].cal ].dateWDDeCase(this.sel[1].no) 
                } 
       
            }
            else{
                let cal = evt.cal;
                let no = evt.no;
                this.sel[0] = { cal:cal,no:no}; 
                this.sel[1] = { cal:cal,no:no};
                this.dernierSelection = this.sel;
                evtPeriode = {
                    event : "SelectionFaite",
                    date1 : this.calendriers[this.sel[0].cal ].dateWDDeCase(this.sel[0].no),
                    date2 : this.calendriers[this.sel[1].cal ].dateWDDeCase(this.sel[1].no) 
                }
            }

            if(this.boolClicCalendrier) // On a cliqué sur un calendrier
            {
                let date1JS = DateAdapInfo.versDateJS(evtPeriode.date1);
                let date2JS = DateAdapInfo.versDateJS(evtPeriode.date2);
                this.afficheDatesEntete(date1JS,date2JS);

                this.date1 = evtPeriode.date1;
                this.date2 = evtPeriode.date2;

                this.fire(evtPeriode);
                this.replier(); 
            }

            this.boolClicCalendrier = false;

            for(let i=0;i<this.calendriers.length;i++)
            {
                if(this.modeUnCalendrier())
                {
                    this.calendriers[0].supprimeSelection();
                }
                else
                {
                    this.calendriers[i].supprimeSelection();
                }
            }

            let tmpSel = this.selectionTriée();
            if (tmpSel[0].cal==tmpSel[1].cal) { // Sélection sur un seul calendrier
                this.calendriers[tmpSel[0].cal].selectionne(tmpSel[0].no,tmpSel[1].no);
            } 
            else{ // sélection à cheval sur 2 calendriers
                    this.calendriers[tmpSel[0].cal].selectionne ( tmpSel[0].no , -1);
                    this.calendriers[tmpSel[1].cal].selectionne (           -1 , tmpSel[1].no);
            }  
    
             
        }

        // Container Class
        if(evt.event == "selectFin"  && (this.selectionEnCours)) {

            // on a relaché la souris en dehors du calendrier !
            this.selectionEnCours=false;

            if(this.modeUnCalendrier())
            {
                // @TODO traitement éventuel
                return 
            }

            if(this.boolClicCalendrier)
            {
                this.dernierSelection = this.selectionTriée();
                this.date1 = this.calendriers[this.dernierSelection[0].cal].dateWDDeCase(this.dernierSelection[0].no);
                this.date2 = this.calendriers[this.dernierSelection[1].cal].dateWDDeCase(this.dernierSelection[1].no);
                let evt = {
                    event : "SelectionFaite",
                    date1 : this.date1,
                    date2 : this.date2
                }

                this.fire(evt);

                let date1JS = DateAdapInfo.versDateJS(evt.date1);
                let date2JS = DateAdapInfo.versDateJS(evt.date2);
                this.afficheDatesEntete(date1JS,date2JS);
                this.replier();
            }   
        }

        // Container Class
        if(evt.event == "mouseHover")
        {
            // on balade la souris sur une des cases du calendrier
            if(!this.selectionEnCours) { // pas de sélection en cours...
                let dateHover = document.querySelectorAll("div[data-divcalendrierno='"+evt.cal+"'] td")[evt.no].getAttribute("data-datewd");
                // let dateHover = $(document).find('div[data-divcalendrierno='+evt.cal+'] td').eq(evt.no).attr("data-datewd");
                let evtPeriode = {
                    event : "SelectionJhesite",
                    date1 : dateHover,
                    date2 : dateHover
                }
                this.fire(evtPeriode);
                return;
            }
            // sinon étendre la sélection
            for(let i=0;i<this.calendriers.length;i++)
            {
                if(this.modeUnCalendrier())
                {
                    this.calendriers[0].supprimeSelection(); 
                }
                else
                {
                    this.calendriers[i].supprimeSelection();
                }
            }
            this.sel[1] = {cal:evt.cal,no:evt.no};

            // on ne touche pas à sel[0] et sel[1] de l'objet en cours
            // mais avec une copie

            if(!isNaN(evt.cal)) // On vérifie qu'il est sur un calendrier (pour le touchmove)
            {
                let tmpSel = this.selectionTriée();

                if (tmpSel[0].cal==tmpSel[1].cal) {
                    // Sélection sur un seul calendrier
                    this.calendriers[tmpSel[0].cal].selectionne(tmpSel[0].no,tmpSel[1].no);
                } else {
                        this.calendriers[tmpSel[0].cal].selectionne ( tmpSel[0].no , -1);
                        this.calendriers[tmpSel[1].cal].selectionne (           -1 , tmpSel[1].no);
                        // sélection à cheval sur 2 calendriers
                }

                let cal = this.sel[1].cal;
                let no = this.sel[1].no;
                let date2WD = document.querySelectorAll("div[data-divcalendrierno='"+cal+"'] td")[no].getAttribute("data-datewd");
                // let date2WD = $('div[data-divcalendrierno='+cal+'] td').eq(no).attr("data-datewd");
                var date1 = DateAdapInfo.versDateJS(this.date1);
                var date2 = DateAdapInfo.versDateJS(date2WD)
                if(date1>date2)
                {
                    let dateSwap = date1;
                    date1 = date2;
                    date2 = dateSwap;
                }
                 if(this.boolPlageSelection){
                    this.fire({
                        event : "SelectionExtension",
                        date1 : DateAdapInfo.versDateWeb(date1),
                        date2 : DateAdapInfo.versDateWeb(date2)
                    });
                 }
                 else
                 {
                     this.fire({
                         event : "SelectionExtension",
                         date1 : DateAdapInfo.versDateWeb(date2),
                         date2 : DateAdapInfo.versDateWeb(date2)
                     });
                 }

            }        
        }

        // Container Class
        if(evt.event == "dateAChangé") {
                // un calendrier a changé sa date ( mois prec ou suivnant)
                // normalement il s'est mis à jour tout seul
                // du coup supprimer sa sélection
                this.sel[0] = {cal:-1,no:-1};
                this.sel[1] = {cal:-1,no:-1};
                
                let currentDate = new Date();
                let nextCalendrier =0;

                if(!this.modeUnCalendrier())
                {
                    if(this.calendriers[0].date.getMonth() == this.calendriers[1].date.getMonth())
                    {
                        let dateCal1 = this.calendriers[0].date;
                        let nouvelleDate;
                        let cal;
                        let boolUpdate = false;
                        if(evt.mois == "precedent")
                        {
                            cal = 0;
                            nouvelleDate = new Date(dateCal1.getFullYear(),dateCal1.getMonth()-1,"1");
                            if(nouvelleDate < new Date())
                            {
                                let currentDate = new Date();
                                nouvelleDate = currentDate;
                                let dateCal2 = new Date(nouvelleDate.getFullYear(),(nouvelleDate.getMonth()+1),"1");
                                this.calendriers[0].dateRecalcule(nouvelleDate);
                                this.calendriers[1].dateRecalcule(dateCal2);
                                boolUpdate = true;
                            }

                        }
                        if(evt.mois == "suivant")
                        {
                            cal = 1;
                            nouvelleDate = new Date(dateCal1.getFullYear(),dateCal1.getMonth()+1,"1");
                        }
                        if(nouvelleDate<new Date())
                        {
                            nouvelleDate = new Date();
                        }
                        if(!boolUpdate)
                        {
                            this.calendriers[cal].dateRecalcule(nouvelleDate);
                        }
                    }
                }
                if(document.querySelector(".btn_active"))
                {
                    document.querySelector(".btn_active").classList.remove("btn_active")
                }
                // $('input.btn_active').toggleClass('btn_active',false);
                this.supprimeDate();
                let dateChange = evt.sender.date;
                this.calendriers[evt.sender.numero].supprimeSelection();  
                
                // Repeindre les jours où il y a des spectacles
                this.supprimeAffichageRepresentation();
                this.afficheHeureRepresentation();
                this.fire({
                    event:"Changement de mois",
                    // autres infos..
                });
        }

    }

    // Container Class
    selectionTriée(){
        
        let tmpSel=[
                Object.assign({},this.sel[0]),
                Object.assign({},this.sel[1]),
                ];

            // si 2eme date choisie inférieure à 1ere date choisie 
            if ( ((tmpSel[0].cal)*50)+(tmpSel[0].no) >  ((tmpSel[1].cal)*50)+(tmpSel[1].no) ) 
            {
                // on permute
                let tmpSwap=Object.assign({},tmpSel[1]);
                tmpSel[1]=Object.assign({},tmpSel[0]);
                tmpSel[0]=tmpSwap;
            }
        return tmpSel;
    }
    // Container Class
    subscribe(fn)
    {
        this.observers.push(fn);
    }

    // Container Class
    unsubscribe(fn) {
        this.observers = this.observers.filter(
            function (item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    }

    // Container Class
    fire(evt) {
        let thisCal = this;
        this.observers.forEach(function (item) {
            evt.sender = thisCal;
            item.onPeriodeEvent(evt);
        });
    }

    // Container Class
    ajouteGestionFiltre() {

        document.querySelectorAll("div[data-name='legende-calendrier'] input[type=submit]").forEach((btn)=>{
            btn.addEventListener("click",(evt)=>{
                let btn = evt.target.getAttribute("data-calbtn"); // Récupère la valeur du bouton
                if(document.querySelector(".btn_active"))
                {
                    document.querySelector(".btn_active").classList.remove("btn_active");
                }
                
                // $(".btn_active").toggleClass('btn_active',false); // Supprime le btn active pour l'actualiser
                evt.target.classList.add('btn_active');
                let checkbox = document.querySelector(".checkbox");
                // let checkbox = $(document).find('.checkbox');
                this.boolActif = true;
                checkbox.checked = this.boolActif;
                // checkbox.prop("checked",this.boolActif);
                
                if(btn == "jourencours")
                {
                    this.onAujourdhuiCaseNo();     
                }
                if(btn == "semaineencours")
                {
                    this.onAcetteSemaine();
                }
                if(btn == "joursprochains")
                {
                    this.onJoursProchains(3); // X Jours
                }
                if(btn == "weekendprochain")
                {
                    this.onWeekEndProchain(); 
                }
                if(btn == "moisencours")
                {
                    this.onCeMois();
                }
            })
        });

    } 

    // Container Class
    selectionnePeriode(ncal,date1,date2) {

        this.calendriers[ncal].selectionnePeriode(date1,date2);
        let date1JS = DateAdapInfo.versDateJS(evt.date1);
        let date2JS = DateAdapInfo.versDateJS(evt.date2);
        this.afficheDatesEntete(date1JS,date2JS);

        let evt = {
            event:"SelectionFaite",
            date1 : this.date1,
            date2 : this.date2 
        }

        this.fire(evt);
        this.replier();
    }

    // Container Class
    onAujourdhuiCaseNo(){

        let date = new Date();
        let boolMoisAffiche = false;
        this.supprimeSelection();
        this.sel[0] = this.caseDate(date);
        this.sel[1] = this.caseDate(date);
        for(let i=0;(i<this.calendriers.length);i++)
        {
            if((this.calendriers[i] != null) && (this.calendriers[i].date.getMonth()==date.getMonth()))
            {
                this.calendriers[i].selectionneDate(date,date);
                this.afficheDatesEntete(date,date);
                boolMoisAffiche = true;
            }
        }
        if(!boolMoisAffiche)
        {
            let newDomJours = this.calendriers[0].generateTab(0,date);
            document.querySelector("div[data-divcalendrierno='0']>table").remove();
            document.querySelector("div[data-divcalendrierno='0']").insertAdjacentHTML('beforeend',newDomJours)
            this.calendriers[0].selectionneDate(date,date);
            this.afficheDatesEntete(date,date);
        }

        let evtPeriode = {
            event:"SelectionFaite",
            date1 : DateAdapInfo.versDateWeb(date),
            date2 : DateAdapInfo.versDateWeb(date),
        }

        this.date1 = DateAdapInfo.versDateWeb(date);
        this.date2 = DateAdapInfo.versDateWeb(date);

        this.fire(evtPeriode);
    }

    // Container Class
    onAcetteSemaine() {

        let boolMoisAffiche = false;
        let date = new Date(); // Nouvelle date actuelle
        let cpt = 0; // Compter le nombre de jour restant dans la semaine (ex : mercredi au dimanche et non mercredi au mercredi)
        for(let i=date.getDay();i<7;i++)
        {
            cpt++;
        }
        let dateSemaine = new Date(date.getFullYear(),date.getMonth(),date.getDate()+cpt) // Date fin de semaine
        this.sel[0] = this.caseDate(date);
        this.sel[1] = this.caseDate(dateSemaine);
        this.supprimeSelection();
        for(let i=0;(i<this.calendriers.length);i++)
        {
            if((this.calendriers[i] != null) && (this.calendriers[i].date.getMonth()==date.getMonth()))
            {
                this.calendriers[i].selectionneDate(date,dateSemaine);
                this.afficheDatesEntete(date,dateSemaine);
                boolMoisAffiche = true;
            }
        }
        if(!boolMoisAffiche)
        {
            let newDomJours = this.calendriers[0].generateTab(0,date);
            document.querySelector("div[data-divcalendrierno='0']>table").remove();
            document.querySelector("div[data-divcalendrierno='0']").insertAdjacentHTML('beforeend',newDomJours)
            this.calendriers[0].selectionneDate(date,dateSemaine);
            this.afficheDatesEntete(date,dateSemaine);
        }

        let evtPeriode = {
            event:"SelectionFaite",
            date1 : DateAdapInfo.versDateWeb(date),
            date2 : DateAdapInfo.versDateWeb(dateSemaine),
        }
        this.date1 = DateAdapInfo.versDateWeb(date);
        this.date2 = DateAdapInfo.versDateWeb(dateSemaine);

        this.fire(evtPeriode);
    }

    // Container Class
    onCeMois() {

        let dateJ1 = new Date(); // Date actuelle
        let month = dateJ1.getMonth();
        let boolMoisAffiche = false;
        let year = dateJ1.getFullYear()+Math.floor(dateJ1.getMonth()/12);
        let nbJoursMois = new Date(year,month+1,-1).getDate()+1;
        let dateJ2 = new Date(year,month,nbJoursMois); // Dernier jour du mois actuel
        this.sel[0] = this.caseDate(dateJ1);
        this.sel[1] = this.caseDate(dateJ2);
        this.supprimeSelection();

        for(let i=0;(i<this.calendriers.length);i++)
        {
            if((this.calendriers[i] != null) && (this.calendriers[i].date.getMonth()==dateJ1.getMonth()))
            {
                this.calendriers[i].selectionneDate(dateJ1,dateJ2);
                this.afficheDatesEntete(dateJ1,dateJ2);
                boolMoisAffiche = true;
            }
        }

        if(!boolMoisAffiche)
        {
            let newDomJours = this.calendriers[0].generateTab(0,dateJ1);
            document.querySelector("div[data-divcalendrierno='0']>table").remove();
            document.querySelector("div[data-divcalendrierno='0']").insertAdjacentHTML('beforeend',newDomJours)
            this.calendriers[0].selectionneDate(dateJ1,dateJ2);
            this.afficheDatesEntete(dateJ1,dateJ2);
        }

        let evtPeriode = {
            event:"SelectionFaite",
            date1 : DateAdapInfo.versDateWeb(dateJ1),
            date2 : DateAdapInfo.versDateWeb(dateJ2),
        }

        this.date1 = DateAdapInfo.versDateWeb(dateJ1);
        this.date2 = DateAdapInfo.versDateWeb(dateJ2);

        this.fire(evtPeriode);

    }    

    // Container Class
    onJoursProchains(days)
    {
        let date = new Date();
        let date2 = new Date(date.getFullYear(),date.getMonth(),(date.getDate()+days));
        let boolMoisAffiche = false;
        this.supprimeSelection();
        this.sel[0] = this.caseDate(date);
        this.sel[1] = this.caseDate(date2);

        for(let i=0;(i<this.calendriers.length);i++)
        {
            if((this.calendriers[i] != null) && (this.calendriers[i].date.getMonth()==date.getMonth()))
            {   
                this.calendriers[i].selectionneDate(date,date2);
                this.afficheDatesEntete(date,date2);
                boolMoisAffiche = true;
            }
        }
        if(!boolMoisAffiche)
        {
            let newDomJours = this.calendriers[0].generateTab(0,date);
            document.querySelector("div[data-divcalendrierno='0']>table").remove();
            document.querySelector("div[data-divcalendrierno='0']").insertAdjacentHTML('beforeend',newDomJours)
            this.calendriers[0].selectionneDate(date,date2);
            this.afficheDatesEntete(date,date2);
        }

        let evtPeriode = {
            event:"SelectionFaite",
            date1 : DateAdapInfo.versDateWeb(date),
            date2 : DateAdapInfo.versDateWeb(date2),
        }

        this.date1 = DateAdapInfo.versDateWeb(date);
        this.date2 = DateAdapInfo.versDateWeb(date2);

        this.fire(evtPeriode);
    }

    // Container Class
    onWeekEndProchain() {

        let boolMoisAffiche = false;
        let date = new Date(); // Date actuelle
        let dateJ1;
        let cpt=0;
        for(let i=date.getDay();i<7;i++)
        {
            dateJ1 = new Date(date.getFullYear(),date.getMonth(),date.getDate()+cpt)
            cpt++;
        }

        let dateJ2 = new Date(dateJ1.getFullYear(),dateJ1.getMonth(),+dateJ1.getDate()+1);
        this.sel[0] = this.caseDate(dateJ1);
        this.sel[1] = this.caseDate(dateJ2);
        this.supprimeSelection();

        for(let i=0;(i<this.calendriers.length);i++)
        {
            if((this.calendriers[i] != null) && (this.calendriers[i].date.getMonth()==date.getMonth()))
            {
                this.calendriers[i].selectionneDate(dateJ1,dateJ2);
                this.afficheDatesEntete(dateJ1,dateJ2);
                boolMoisAffiche = true;
            }
        }

        if(!boolMoisAffiche)
        {
            let newDomJours = this.calendriers[0].generateTab(0,date);
            document.querySelector("div[data-divcalendrierno='0']>table").remove();
            document.querySelector("div[data-divcalendrierno='0']").insertAdjacentHTML('beforeend',newDomJours)
            this.calendriers[0].selectionneDate(dateJ1,dateJ2);
            this.afficheDatesEntete(dateJ1,dateJ2);
        }

        let evtPeriode = {
            event:"SelectionFaite",
            date1 : DateAdapInfo.versDateWeb(dateJ1),
            date2 : DateAdapInfo.versDateWeb(dateJ2),
        }

        this.date1 = DateAdapInfo.versDateWeb(dateJ1);
        this.date2 = DateAdapInfo.versDateWeb(dateJ2);

        this.fire(evtPeriode);
    }      

    // Container Class
    supprimeSelection(){
        for(let i = 0;i<this.calendriers.length;i++)
        {
            if(this.modeUnCalendrier())
            {
                this.calendriers[0].supprimeSelection();
            }
            else{
                this.calendriers[i].supprimeSelection();
            }

        }
    }
    
    // Container class
    deplier()
    {
        document.querySelectorAll("div[data-name='calendrier']").forEach((cal)=>{
            cal.style.display = "block";
        })

        if(this.boolPlageSelection){ // Affichage des filtres uniquement si plageSélection
            document.querySelector("div[data-name='legende-calendrier']").style.display = "block";
        }
        this.boolContainerVisible = true;
    }

    // Container class
    replier()
    {
        document.querySelectorAll("div[data-name='calendrier']").forEach((cal)=>{
            cal.style.display = "none";
        })
        document.querySelector("div[data-name='legende-calendrier']").style.display = "none";
        this.boolContainerVisible = false;      
    }
}