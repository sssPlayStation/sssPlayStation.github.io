'use strict';

app.controller('playStationCtrl', ['$scope', "$timeout", "$window", "playStationService",
    function(scope, timeout, $window, playStationService) {

        var promise;
        var systems = playStationService.getSystems();
        var customers = playStationService.getCustomers();
        var waitingList = playStationService.getWaitingList();

        if (systems === null) {
            playStationService.setSystems();
            systems = playStationService.getSystems();
        }
        if (customers === null) {
            playStationService.setCustomers();
            customers = playStationService.getCustomers();
        }
        if (waitingList === null) {
            playStationService.setWaitingList();
            waitingList = playStationService.getWaitingList();
        }

        scope.numberOfSystems= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        scope.systems = systems;
        scope.customers = customers;
        scope.waitingList = waitingList;
        scope.master = [];

        scope.activeCustomers = [];
        scope.inActiveCustomers = [];

        var laterTime;
        var date;

        scope.membersList = [{
            key: "1 or 2 Players",
            value: 1
        }, {
            key: "3 or 4 Players",
            value: 2
        }, {
            key: "5 or 6 Players",
            value: 3
        }];

        scope.durationsList = [{
            key: "30 mins",
            value: 1
        }, {
            key: "60 mins",
            value: 2
        }];

        var priceList = [
            [10, 20],
            [30, 40],
            [40, 50]
        ];

        var reset = function(systemNumber) {
            return {
                systemNumber: systemNumber,
                customer: {
                    name: null,
                    disable: false
                },
                members: {
                    count: 1,
                    disable: false
                },
                duration: {
                    hours: 1,
                    disable: false
                },
                startBtn: {
                    disable: true,
                    show: true
                },
                continueBtn: {
                    disable: true,
                    show: false
                },
                editBtn: {
                    disable: true,
                    show: false
                },
                stopBtn: {
                    disable: true,
                    show: false
                },
                cancelBtn: {
                    disable: true,
                    show: false
                },
                updateBtn: {
                    disable: true,
                    show: false
                },
                invoiceDetails: [],
                startTime: {
                    value: null,
                    show: false
                },
                endTime: {
                    value: null,
                    show: false
                },
                timeStamp: null,
                amount: null,
                status: false,
                editMode: false,
                cancelGameBtn: {
                    disable: true,
                    show: false
                },
                timeFinish: false,
                editStartTimePanel: {
                    disable: true,
                    show: false
                }
            }
        };

        scope.waiting = new reset("null");

        scope.systemStatus= function(index)
        {
            var flag=false;
            angular.forEach(scope.systems, function(system){
                if(system!=null){
                if(system.systemNumber==index && system.status){
                    flag=true;
                }
            }
            })
            return flag;
        };

        scope.start = function(obj, index) {
            console.log(obj)
            obj.status = true;
            obj.amount = null;
            date = new Date();
            obj.timeStamp = date;
            laterTime = new Date(date.getTime() + obj.duration.hours * 30 * 60 * 1000);
            obj.timeInterval = laterTime - date;

            obj.customer.disable = true;
            obj.members.disable = true;
            obj.duration.disable = true;

            obj.startBtn.disable = true;
            obj.startBtn.show = false;

            obj.stopBtn.disable = false;
            obj.stopBtn.show = true;

            obj.editBtn.disable = false;
            obj.editBtn.show = true;

            obj.cancelGameBtn.show = true;

            obj.editStartTimePanel.show = false;


            obj.startTime.value = date;
            obj.endTime.value = new Date(laterTime);

            obj.invoiceDetails.push({
                'mem': scope.membersList[obj.members.count - 1].key,
                'mins': scope.durationsList[obj.duration.hours - 1].key,
                'duration': {
                    st: obj.startTime.value,
                    et: obj.endTime.value
                },
                'amt': priceList[obj.members.count - 1][obj.duration.hours - 1]
            });
            for (var i = 0; i < obj.invoiceDetails.length; i++) {
                obj.amount += obj.invoiceDetails[i].amt;
            }
            scope.systems[index]= obj;
            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
            promise = timeout(function() {
                scope.systems[index].timeFinish = true;
                scope.systems[index].members.disable = false;
                scope.systems[index].duration.disable = false;
                scope.systems[index].continueBtn.disable = false;
                scope.systems[index].continueBtn.show = true;

                scope.systems[index].editBtn.disable = true;
                scope.systems[index].editBtn.show = false;

                document.getElementById("play" + index).play();
                $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
            }, obj.timeInterval);
            scope.waiting = new reset("null");
        };

        scope.enableEdit = function(obj, index) {
            if (!obj.customer.name && !obj.members.count && !obj.duration.hours && obj.startBtn.disable) {
                obj.editBtn.disable = false;
                obj.editBtn.show = true;
            } else {
                obj.editBtn.disable = true;
                obj.editBtn.show = false;
            }
            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
        };

        scope.edit = function(obj, index) {
            obj.startBtn.disable = true;
            scope.master[index] = angular.copy(obj);
            obj.editMode = true;

            obj.members.disable = false;
            obj.duration.disable = false;


            obj.editBtn.disable = true;
            obj.editBtn.show = false;

            obj.updateBtn.disable = false;
            obj.updateBtn.show = true;

            obj.cancelBtn.disable = false;
            obj.cancelBtn.show = true;

            obj.editStartTimePanel.show = true;

            obj.cancelGameBtn.show = true;

            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
        };

        scope.update = function(obj, index) {
            obj.amount = null;
            obj.endTime.value = new Date(new Date(obj.startTime.value).getTime() + (obj.duration.hours * 30 * 60 * 1000));
            obj.invoiceDetails[obj.invoiceDetails.length - 1].mem = scope.membersList[obj.members.count - 1].key;
            obj.invoiceDetails[obj.invoiceDetails.length - 1].duration = {
                st: obj.startTime.value,
                et: obj.endTime.value
            };
            obj.invoiceDetails[obj.invoiceDetails.length - 1].mins = scope.durationsList[obj.duration.hours - 1].key;
            obj.invoiceDetails[obj.invoiceDetails.length - 1].amt = priceList[obj.members.count - 1][obj.duration.hours - 1];

            obj.editMode = false;

            obj.editStartTimePanel.show = false;

            obj.cancelGameBtn.show = true;

            for (var i = 0; i < obj.invoiceDetails.length; i++) {
                obj.amount += obj.invoiceDetails[i].amt;
            }

            promise = timeout(function() {
                obj.timeFinish = true;
                obj.members.disable = false;
                obj.duration.disable = false;
                obj.continueBtn.show = true;
                obj.editBtn.show = false;
                document.getElementById("#play" + obj.systemNumber).play();
                $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
            }, (obj.duration.hours * 30 * 1000 * 60));

            obj.members.disable = true;
            obj.duration.disable = true;
            obj.startBtn.disable = true;

            obj.editBtn.disable = false;
            obj.editBtn.show = true;

            obj.updateBtn.show = false;
            obj.cancelBtn.show = false;
            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
        };
        scope.cancel = function(obj, index) {
            angular.copy(scope.master[index], obj);
            // obj.editMode = false;
            // obj.editBtn.show = true;
            // obj.updateBtn.show = false;
            // obj.cancelBtn.show = false;

            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
        };

        scope.continue = function(obj, index) {
            obj.amount = null;
            obj.members.disable = true;
            obj.duration.disable = true;
            obj.editBtn.show = true;
            obj.editBtn.disable = false;

            obj.continueBtn.disable = true;
            obj.continueBtn.show = false;
            obj.startTime.show = true;

            var et = new Date(obj.endTime.value).getTime() + (obj.duration.hours * 30 * 60 * 1000);
            obj.endTime.show = true;
            obj.invoiceDetails.push({
                'mem': scope.membersList[obj.members.count - 1].key,
                'mins': scope.durationsList[obj.duration.hours - 1].key,
                'duration': {
                    st: obj.endTime.value,
                    et: new Date(et)
                },
                'amt': priceList[obj.members.count - 1][obj.duration.hours - 1]
            });

            obj.endTime.value = new Date(et);
            obj.status = true;

            for (var i = 0; i < obj.invoiceDetails.length; i++) {
                obj.amount += obj.invoiceDetails[i].amt;
            }

            obj.timeFinish = false;
            document.getElementById("play" + index).pause();

            promise = timeout(function() {
                    obj.timeFinish = true;
                    obj.members.disable = false;
                    obj.duration.disable = false;
                    obj.continueBtn.disable = false;
                    obj.continueBtn.show = true;
                    obj.editBtn.show = false;
                    obj.editBtn.disable = true;


                    document.getElementById("play" + index).play();
                    $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
                }, (obj.duration.hours * 30 * 1000 * 60)
                //  1000
            );
            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));

        };

        scope.enableContine = function(obj, index) {
            if (obj.members.count == null && obj.duration.hours == null && !obj.timeFinish) {
                return true;
            } else {
                return false;
            }
        }

        scope.stop = function(obj, index) {

            obj.status = false;
            scope.customers.push(obj);
            $window.localStorage.setItem("customers", JSON.stringify(scope.customers));

            document.getElementById("play" + index).pause();
            obj = new reset(index + 1);
            scope.systems[index] = obj;
            timeout.cancel(promise);
            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
        };

        scope.cancelGame = function(obj, index) {
            obj.status = false;
            document.getElementById("play" + index).pause();
            scope.systems[index] = new reset(index + 1);
            timeout.cancel(promise);
            $window.localStorage.setItem("sys", JSON.stringify(scope.systems));
        };


        scope.calculateAmount=function(){
            if(scope.waiting.members.count!=null && scope.waiting.duration.hours!=null ){
                scope.waiting.amount = priceList[scope.waiting.members.count - 1][scope.waiting.duration.hours - 1]                
            }
        };
        
        scope.calculateAmount();
        
        scope.enableWait = function() {
            var flag = true;
            if(scope.waiting.customer.name && scope.waiting.members.count && scope.waiting.duration.hours) {
                flag = false;
            } 
            return flag;
        };
         scope.enableStart = function() {
            var flag = true;
            if (scope.waiting.customer.name && scope.waiting.systemNumber!="null" && scope.waiting.members.count && scope.waiting.duration.hours) {
                flag = false;
            } 
            return flag;
        };
        scope.wait = function(obj) {
            scope.waitingList.push(JSON.parse(JSON.stringify(obj)));
            $window.localStorage.setItem("waitingList", JSON.stringify(scope.waitingList));
        };
        scope.assignSystem = function(obj, systemNumber, index) {
            scope.start(obj, systemNumber);
            scope.waitingList.splice(index, 1);
            $window.localStorage.setItem("waitingList", JSON.stringify(scope.waitingList));
        };

        scope.removeWaiting = function(index) {
            scope.waitingList.splice(index, 1);
            $window.localStorage.setItem("waitingList", JSON.stringify(scope.waitingList));
        };

        scope.cleanSystems = function() {
            $window.localStorage.removeItem("sys")
        };

        scope.cleanCustomers = function() {
            $window.localStorage.removeItem("customers")
        };

        var pad2 = function(number) {
            return (number < 10 ? '0' : '') + number
        };

    }
]);