    'use strict';
    app.factory("playStationService", ['$window',
        function($window) {
            return {
                getSystems: function() {
                    return JSON.parse($window.localStorage.getItem("sys"));
                },
                setSystems: function() {
                    $window.localStorage.setItem("sys", JSON.stringify([]));
                },
                getCustomers: function() {
                    return JSON.parse($window.localStorage.getItem("customers"));
                },
                setCustomers: function() {
                    $window.localStorage.setItem("customers", JSON.stringify([]));
                },
                getWaitingList: function() {
                    return JSON.parse($window.localStorage.getItem("waitingList"));
                },
                setWaitingList: function() {
                    $window.localStorage.setItem("waitingList", JSON.stringify([]));
                }


            }
        }
    ]);