import { EventEmitter, Injectable } from "@angular/core";
import { ProgramModel } from "@app/core/models/program.model";
import { config } from "@app/core/smartadmin.config";
import { NotificationService } from "@app/core/services/notification.service";
import { Router } from "@angular/router";
import { ProgramList } from "@app/core/common/static.enum";

declare var $: any;

@Injectable()
export class ProgramService {
    openedProgramsKey: string = "opened.programs";
    public openedPrograms: Array<ProgramModel> = [];

    getOpenedPrograms = new EventEmitter<Array<ProgramModel>>();

    programsClicked = new EventEmitter<any>();

    constructor(private notificationService: NotificationService,
                private router: Router) {

    }

    ActiveMenu(id) {
        this.openedPrograms.forEach(element => {
            element.active = false;
            if (element.id == id) {
                element.active = true;
            }
        });
        this.setOpenedProgramsLocalStorage();
        
        this.programsClicked.emit(id)

        if(window.parent.length){
            $(window.parent.document).find("iframe").hide();
            $(window.parent.document).find("iframe[id=" + id + "]").show();
        }
        else{
            $("#page").find("iframe").hide();
            $("#page").find("iframe[id="+id+"]").show();
        }
        $('.center-loading').hide();
    }
    
    OpenMenu(menuInfo: ProgramModel) {
        //console.log('OpenMenu',menuInfo)
        var ie=$("#page").find("iframe[id=" + menuInfo.id + "]");
        if (ie.length) {
            this.ActiveMenu(menuInfo.id);
        }
        else {
             $("#page").find("iframe").hide();
            $('<iframe>',
                {
                    src: "/#" + menuInfo.url,
                    id: menuInfo.id,
                    frameborder: 0,
                    scrolling: 'auto',
                    height: '100vh',
                    width: '100%'
                })
                .appendTo('#page');
            setTimeout(() => {
                $('.center-loading').hide();
            }, 1000);
            this.programsClicked.emit(menuInfo.id)
        }
    }

    getOpenedProgramsLocalStorage() {
        var self = this;
        let openedProgramsData = localStorage.getItem(this.openedProgramsKey);
        if (openedProgramsData) {
            this.openedPrograms = JSON.parse(openedProgramsData);
            var countIframe = $("#page").find("iframe").length;
            if (countIframe === 1) {
                //console.log('reopen '+this.openedPrograms.length)
                var activeId = 0;
                $('.center-loading').show();
                this.openedPrograms.forEach(element => {
                    if (element.active) {
                        activeId = element.id;
                    }
                    if (element.id !== ProgramList.Rocket_Chat) {
                        $('<iframe>',
                            {
                                src: "/#" + element.url,
                                id: element.id,
                                frameborder: 0,
                                scrolling: 'auto',
                                height: '100vh',
                                width: '100%',
                            })
                            .appendTo('#page');
                    }
                });
                
                setTimeout(() => {
                    $('.center-loading').hide();
                    if (activeId !== 0) {
                        self.ActiveMenu(activeId);
                    }
                }, 700 * this.openedPrograms.length);
            }
        }
    }

    setOpenedProgramsLocalStorage() {
        // store array to local storage.
        localStorage.setItem(this.openedProgramsKey, JSON.stringify(this.openedPrograms));
    }
    resetActiveByUrl(url){
        this.openedPrograms.forEach(element => {
            element.active = false;
            if (element.url === url) {
                element.active = true;
            }
        });
    }
    resetActiveById(id){
        this.openedPrograms.forEach(element => {
            element.active = false;
            if (element.id === id) {
                element.active = true;
            }
        });
    }
    addOpenedPrograms(program: ProgramModel): boolean {
        this.getOpenedProgramsLocalStorage();
        if(!this.openedPrograms.filter(x=>x.id==program.id).length){
            this.openedPrograms.push(program);
        }
        //program.active = true;
        //this.addAnimation();

        this.openedPrograms.forEach(element => {
            element.active = false;
            if (element.id == program.id) {
                element.active = true;
            }
        });

        
        this.OpenMenu(program)

        this.setOpenedProgramsLocalStorage();
        this.getOpenedPrograms.emit(this.openedPrograms);
        return true;
    }

    addStyleMasterDetailPrograms(program: ProgramModel): boolean {
        this.getOpenedProgramsLocalStorage();
        if(!this.openedPrograms.filter(x=>x.id==program.id).length){
            this.openedPrograms.push(program);
        }
        this.setOpenedProgramsLocalStorage();
        this.getOpenedPrograms.emit(this.openedPrograms);
        return true;
    }

    clearActivePrograms() {
        this.getOpenedProgramsLocalStorage();

        this.openedPrograms.forEach(element => {
            element.active = false;
        });

        this.setOpenedProgramsLocalStorage();
        this.addAnimation();
        this.getOpenedPrograms.emit(this.openedPrograms);
    }

    refreshOpenedPrograms() {
        this.getOpenedProgramsLocalStorage()
        this.getOpenedPrograms.emit(this.openedPrograms);
    }

    closeCurrentProgram() {
        this.getOpenedProgramsLocalStorage();
        let p = this.openedPrograms.filter(p => p.active==true);
        if(p && p.length>0){
            this.closeOpenedPrograms(p[0].id)
        }
    }

    resetProgramUrl(url) {
        this.getOpenedProgramsLocalStorage();

        this.openedPrograms.forEach(element => {
            if(element.active){
                element.url = url;
            };
        });
        this.setOpenedProgramsLocalStorage();
    }

    closeOpenedPrograms(id: number) {
        this.getOpenedProgramsLocalStorage();
        this.openedPrograms = this.openedPrograms.filter(p => p.id != id);
        //console.log('closeOpenedPrograms',this.openedPrograms)
        //this.addAnimation();
        
        this.setOpenedProgramsLocalStorage();
        this.getOpenedPrograms.emit(this.openedPrograms);
        
        if(window.parent.length){
            //let t=$(window.parent.document).find("#tabs>li[id=" + id + "]>a>i")
            $(window.parent.document).find("#tabs>li[id=" + id + "]>a>i").trigger("click")
            if (id === ProgramList.Rocket_Chat) {
                $(window.parent.document).find("iframe[id=" + id + "]").hide();
            } else {
                $(window.parent.document).find("iframe[id=" + id + "]").remove();
            }
        }
        else{
            if (id === ProgramList.Rocket_Chat) {
                $(window.parent.document).find("iframe[id=" + id + "]").hide();
            } else {
                $("#page").find("iframe[id=" + id + "]").remove();
            }
        }
        if(this.openedPrograms.length){
            //this.openedPrograms[this.openedPrograms.length-1].active=true;
            this.ActiveMenu(this.openedPrograms[this.openedPrograms.length-1].id)
        }
        
        // if (this.openedPrograms.length > 0) {
        //     this.router.navigate([this.openedPrograms[this.openedPrograms.length-1].url]);
        //   } else {
        //     this.router.navigate(['/home']);
        //   }
    }

    closeAllOpenedPrograms() {
        this.getOpenedProgramsLocalStorage();
        this.openedPrograms.forEach(element => {
            if (element.id === ProgramList.Rocket_Chat) {
                $(window.parent.document).find("iframe[id=" + element.id + "]").hide();
            } else {
                $("#page").find("iframe[id=" + element.id + "]").remove();
            }
        });

        this.openedPrograms = [];
        this.addAnimation();
        this.setOpenedProgramsLocalStorage();
        this.getOpenedPrograms.emit(this.openedPrograms);
        //this.router.navigate(['/home']);
    }

    showPopup() {
        this.notificationService.smartMessageBox({
            title: "Notification",
            content: `Maximum ${config.maxOpenedPrograms} programs can be opened!`,
            buttons: '[OK]'
        });
    }

    addAnimation() {
        // $('.dropdown-toggle>b').addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
        // function() {
        //     $(this).removeClass('animated bounce');
        // });
    }

    getCurrentProgram():ProgramModel{
        let p = this.openedPrograms.filter(p => p.active==true);
        if(p && p.length>0){
            return p[0];
        }
        return null;
    }
}