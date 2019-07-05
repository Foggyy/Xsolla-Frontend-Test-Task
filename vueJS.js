
        var app = new Vue({
            el: '#appvue',
            data:{
                title: "Xsolla FrontEnd",
                transactionsDataList: [],
                projectsList: [],
                popularityList: [],
                sortParam: 'id',
                searchProject: '',
                allData: true,
                popularityBool: false     
            },
            created: function(){
                this.getJSONData()
            },
            computed:{
                sortedList(){
                    switch(this.sortParam){
                        case 'id': return this.transactionsDataList.sort(sortById);
                        case 'name': return this.transactionsDataList.sort(sortByName);
                        case 'method': return this.transactionsDataList.sort(sortByMethod);
                        case 'status': return this.transactionsDataList.sort(sortByStatus);
                    }
                },
    
                filteredList: function(){
                    return this.transactionsDataList.filter(element => {
                        return element.transaction.project.name.indexOf(this.searchProject) !== -1;
                    })
                }
            },
            methods:{
                getJSONData(){                                          //выгрузка данных из json
                    this.allData = true;                                //переменная для проверки на вывод списка транзакций
                    this.popularityBool = false;
                    fetch("data.json")
                    .then(response => response.json())                  //проверка на чтение данных
                    .then(data => (this.transactionsDataList = data));  //если успешно, то вывести данные в массив
                    
                },
                getListOfProjects(){                                    //список всех проектов
                    this.projectsList = [];
                    this.allData = false;                               //переменная для проверки на вывод списка транзакций(false => выводится список проектов)
                    this.popularityBool = false;
                    count = 0;
                    for(var i = 0; i<this.transactionsDataList.length; i++){    //цикл для прохода по всем элементам списка транзакций
                        if(i == 0){                                             //добавление первого элемента в список проектов
                            this.projectsList.push(this.transactionsDataList[i].transaction.project);
                        }
                        for(var j = 0; j<this.projectsList.length; j++){        //цикл для прохода по всем элементам списка проектов
                            if(this.projectsList[j].id == this.transactionsDataList[i].transaction.project.id){ 
                                count++;                                        //если найден повторяющийся элемент, то счетчик увеличивается
                            }
                        }
                        if(count == 0){                                         //если повторяющихся элементов не найдено, то добавляем в список проектов новый элемент
                            this.projectsList.push(this.transactionsDataList[i].transaction.project);
                        }
                        count = 0;
                    }
                },
                getPopularityList(){
                    count = 0;
                    AllCount = 0;
                    this.popularityList = [];
                    this.allData = false;
                    this.popularityBool = true;
                    for(var i = 0; i<this.transactionsDataList.length; i++){    //цикл для прохода по всем элементам списка транзакций
                        if(i == 0){
                            var newObject = {};     
                            newObject.payment_method = this.transactionsDataList[i].transaction.payment_method.name;
                            newObject.popularity = 0;                              
                            this.popularityList.push(newObject);
                        }
                        for(var j = 0; j<this.popularityList.length; j++){        //цикл для прохода по всем элементам списка проектов
                            if(this.popularityList[j].payment_method == this.transactionsDataList[i].transaction.payment_method.name){ 
                                count++;                                        //если найден повторяющийся элемент, то счетчик увеличивается
                            }
                        }
                        if(count == 0){                                         //если повторяющихся элементов не найдено, то добавляем в список проектов новый элемент
                            var newObject = {};     
                            newObject.payment_method = this.transactionsDataList[i].transaction.payment_method.name;
                            newObject.popularity = 0;
                            this.popularityList.push(newObject);
                        }
                        count = 0;
                        AllCount++;
                    }

                    for(var i = 0; i<this.popularityList.length; i++){    //цикл для прохода по всем элементам списка транзакций
                        for(var j = 0; j<this.transactionsDataList.length; j++){        //цикл для прохода по всем элементам списка проектов
                            if(this.transactionsDataList[j].transaction.payment_method.name == this.popularityList[i].payment_method){ 
                                this.popularityList[i].popularity++;                                        
                            }
                        }
                    }

                    for(var i=0; i<this.popularityList.length; i++){
                        this.popularityList[i].popularity = (this.popularityList[i].popularity/AllCount).toFixed(4);
                    }

                    this.popularityList.sort(sortByPopularity);
                }           
            }
        })
    
        var sortById = function(d1,d2) {return (d1.transaction.id > d2.transaction.id) ? 1 : -1;};
        var sortByName = function(d1,d2) {return (d1.transaction.project.name.toLowerCase() > d2.transaction.project.name.toLowerCase()) ? 1 : -1;};
        var sortByMethod = function(d1,d2) {return (d1.transaction.payment_method.name.toLowerCase() > d2.transaction.payment_method.name.toLowerCase()) ? 1 : -1;};
        var sortByStatus = function(d1,d2) {return (d1.transaction.status.toLowerCase() > d2.transaction.status.toLowerCase()) ? 1 : -1;};
        var sortByPopularity = function(d1,d2) {return (d1.popularity < d2.popularity) ? 1 : -1;};
    
