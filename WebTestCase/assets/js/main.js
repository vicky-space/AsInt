this.masterData = null;
this.tableData = null;
/*onPageLoad JSON Test on Table - Start*/
function getMasterData(Property) {
    var that = this;
    if (!this.masterData) {
        var path = "./data/data.json";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    that.masterData = JSON.parse(xhr.responseText);
                } else {
                    console.error(xhr);
                }
            }
        };
        xhr.open("GET", path, false);
        xhr.send();
    }
    if (Property) {
        return this.masterData[Property];
    } else {
        return this.masterData;
    }
}

window.onload = function () {
    var ProductCollection = getMasterData("ProductCollection");
    refreshTable(ProductCollection);
};

function prepareData(jsonData) {
    dataInfo = jsonData.map(function (jsonData) { //Reframe the required data from given JSON
        var info = { "productID": jsonData.ProductId, "productName": jsonData.Name, "supplier": jsonData.SupplierName, "prdDimension": jsonData.Width + " x " + jsonData.Depth + " x " + jsonData.Height + " " + jsonData.DimUnit, "prdWeight": jsonData.WeightMeasure + " " + jsonData.WeightUnit, "prdPrice": jsonData.Price + " " + jsonData.CurrencyCode }
        return info;
    });
    return dataInfo;

}
/*onPageLoad JSON Test on Table - End*/

/*Table data append - Start*/
function refreshTable(jsonData) {
    this.tableData = jsonData;
    dataInfo = prepareData(jsonData);
    var tableContent = document.querySelector('#dynamic_prdData');
    if (tableContent) {
        document.getElementById("dynamic_prdData").remove();
    }
    tableContent = document.createElement('tbody');
    tableContent.setAttribute("id", "dynamic_prdData");
    dataInfo.forEach(element => {
        const row = document.createElement('tr');
        tableContent.appendChild(row);
        const cell = document.createElement('td');
        cell.innerText = element.productID;
        row.appendChild(cell);
        const cell1 = document.createElement('td');
        cell1.innerText = element.productName;
        row.appendChild(cell1);
        const cell2 = document.createElement('td');
        cell2.innerText = element.supplier;
        row.appendChild(cell2);
        const cell3 = document.createElement('td');
        cell3.innerText = element.prdDimension;
        row.appendChild(cell3);
        const cell4 = document.createElement('td');
        cell4.innerText = element.prdWeight;
        row.appendChild(cell4);
        const cell5 = document.createElement('td');
        cell5.innerText = element.prdPrice;
        row.appendChild(cell5);
    });
    document.getElementById("idParent").appendChild(tableContent);
}
/*Table data append - End*/

/*SubFilter Display function - Start*/
function displaySubFilter(_this) {
    var div = _this.classList;
    if (div.contains("filter_active")) {
        document.getElementById('body_top_hidden_filter').style.display = "none";
        document.getElementById('btn_filter').value = "Show Filter Bar";
        document.getElementById('btn_filter').classList.remove("filter_active");
    } else {
        document.getElementById('body_top_hidden_filter').style.display = "block";
        document.getElementById('btn_filter').value = "Hide Filter Bar";
        document.getElementById('btn_filter').classList.add("filter_active");
    }
}
/*SubFilter Display function - Start*/

/*Search Filter function - Start*/
function myCustomFilterForAnd(Array, CustomFilter) {
    if (CustomFilter.length > 0) {
        return Array.filter(function (Item) {
            var Result = [];
            var bReturn = false;
            CustomFilter.forEach(function (Filter) {
                if (Item[Filter.UserField].toString().toLowerCase().includes(Filter.Value.toString().toLowerCase())) {
                    bReturn = true;
                    Result.push(true);
                }else{
                    Result.push(false);
                }
            });
            return  Result.includes(false) ? false :  true;
        });
    } else { return Array; };

}

function myCustomSearch(Array, CustomSearch) {
    if (CustomSearch.length > 0) {
        return Array.filter(function (Item) {
            var bReturn = false;
            CustomSearch.forEach(function (Filter) {
                if (!bReturn) {
                    if (Item[Filter.UserField].toString().toLowerCase().includes(Filter.Value.toString().toLowerCase())) {
                        bReturn = true;
                    }
                }
            });
            return  bReturn;
        });
    } else { return Array; };

}

function searchFilter() {
    var map = {
        "sub_prdId": "ProductId",
        "sub_prdName":"Name",
        "sub_prdSupplier":"SupplierName"
    };
    let main_search = document.getElementById('txt_search').value.toLowerCase();
    let sub_prdId = document.getElementById('txt_prdId').value.toLowerCase();
    let sub_prdName = document.getElementById('txt_prdName').value.toLowerCase();
    let sub_prdSupplier = document.getElementById('txt_supplier').value.toLowerCase();

    var CustomFilter = [],CustomSearch = [];
    if (main_search) {
        Object.keys(map).forEach(function (Key) {
            CustomSearch.push({
                UserField: map[Key],
                Value: main_search
            });
        })
    }
    if (sub_prdId) {
        CustomFilter.push({
            UserField: map["sub_prdId"],
            Value: sub_prdId
        });
    }
    if (sub_prdName) {
        CustomFilter.push({
            UserField: map["sub_prdName"],
            Value: sub_prdName
        });
    }
    if (sub_prdSupplier) {
        CustomFilter.push({
            UserField: map["sub_prdSupplier"],
            Value: sub_prdSupplier
        });
    }
    var JsonData = [];
    if(CustomFilter){
        JsonData = myCustomFilterForAnd(getMasterData("ProductCollection"), CustomFilter);
    }
    if(CustomSearch){
        if(CustomFilter){
            JsonData = myCustomSearch(JsonData, CustomSearch);
        }else{
            JsonData = myCustomSearch(getMasterData("ProductCollection"), CustomSearch);
        }
    }
    refreshTable(JsonData);
}
/* Search Filter function - End*/

/* Table Sort function - Start*/
function display_tbl_Sort() {
    document.getElementById('model_sort').style.display = "block";
    document.getElementById('myModal_sort').style.display = "block";
    document.getElementById("default").classList.add("hasActivemodal");
}
function display_tbl_Filter() {
    document.getElementById('model_filter').style.display = "block";
    document.getElementById('myModal_filter').style.display = "block";
    document.getElementById("default").classList.add("hasActivemodal");
}
function hide_tbl_Sort(_this) {
    var div = _this.classList;
    if (div.contains("action_cancel")) {
        document.getElementById('model_sort').style.display = "none";
        document.getElementById('myModal_sort').style.display = "none";
        document.getElementById("default").classList.remove("hasActivemodal");
    } else if (div.contains("action_ok")) {
        let chk_data = '', sort_by = '', chk_method = 'sort', sort_typ = '';
        if (document.getElementById("rdo_btn_prdId").checked) {
            chk_data = document.getElementById("rdo_btn_prdId").value;
            sort_by = 'ProductId';
        } else if (document.getElementById("rdo_btn_name").checked) {
            chk_data = document.getElementById("rdo_btn_name").value;
            sort_by = 'Name';
        } else if (document.getElementById("rdo_btn_supplier").checked) {
            chk_data = document.getElementById("rdo_btn_supplier").value;
            sort_by = 'SupplierName';
        } else if (document.getElementById("rdo_btn_weight").checked) {
            chk_data = document.getElementById("rdo_btn_weight").value;
            sort_by = 'WeightMeasure';
        } else if (document.getElementById("rdo_btn_price").checked) {
            chk_data = document.getElementById("rdo_btn_price").value;
            sort_by = 'Price';
        }
        /* Asc - Desc check*/
        if (document.getElementById("rdo_btn_asc").checked) {
            sort_typ = document.getElementById("rdo_btn_asc").value;
        } else if (document.getElementById("rdo_btn_dec").checked) {
            sort_typ = document.getElementById("rdo_btn_dec").value;
        }
        sortFilter(chk_method, chk_data, sort_by, sort_typ);
        document.getElementById('model_sort').style.display = "none";
        document.getElementById('myModal_sort').style.display = "none";
        document.getElementById("default").classList.remove("hasActivemodal");
    }
}
function hide_tbl_filter(_this) {
    var div = _this.classList;
    if (div.contains("action_cancel")) {
        document.getElementById('model_filter').style.display = "none";
        document.getElementById('myModal_filter').style.display = "none";
        document.getElementById("default").classList.remove("hasActivemodal");
    } else if (div.contains("action_ok")) {
        let chk_data = '', chk_method = 'filter';
        if (document.getElementById("rdo_btn_lsth").checked) {
            chk_data = '100';
        } else if (document.getElementById("rdo_btn_btwn").checked) {
            chk_data = '1000';
        } else if (document.getElementById("rdo_btn_mrtn").checked) {
            chk_data = '1001';
        }
        sortFilter(chk_method, chk_data);
        document.getElementById('model_filter').style.display = "none";
        document.getElementById('myModal_filter').style.display = "none";
        document.getElementById("default").classList.remove("hasActivemodal");
        document.getElementById("filter_modal_body_bottom").classList.remove("active");
        document.getElementById("modal-header").classList.remove("active");
        document.getElementById("modal_body_top").classList.remove("active");
    }
}
function myCustomSort(SortType, SortKey) {
    return this.tableData.sort(function(a,b){
        if(SortType == 'Ascending'){
            if (a[SortKey] < b[SortKey]) {
                return -1;
            }
            if (a[SortKey] > b[SortKey]) {
                return 1;
            }
            return 0;
        }else{
            if (b[SortKey] < a[SortKey]) {
                return -1;
            }
            if (b[SortKey] > a[SortKey]) {
                return 1;
            }
        }
    });
}
function sortFilter(chk_method, chk_data, sort_by, sort_typ) {
    let table = document.getElementById("dynamic_prdData");
    let tr = table.getElementsByTagName("tr");
    if (chk_method == 'filter') {
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[5];
            if (td) {
                txtValue = td.textContent || td.innerText;
                data = txtValue.replace(/[a-z]/gi, '');
                if (chk_data == 100) {
                    if (data <= 100) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                } else if (chk_data == 1000) {
                    if (data > 100 && data < 1000) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                } else if (chk_data == 1001) {
                    if (data >= 1000) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                } else {
                    tr[i].style.display = "";
                }
            }
        }
    } else if (chk_method == 'sort') {
        refreshTable(myCustomSort(sort_typ, sort_by));
    }

}
/* Table Sort function - End*/

/* Modal Radio button checked Reset button enable - Start*/
function filterShow(_this) {
    let type = _this.innerText;
    document.getElementById("selected_filter").innerText = type;
    document.getElementById("modal_body_top").classList.add("active");
    document.getElementById("modal-header").classList.add("active");
    document.getElementById("filter_modal_body_bottom").classList.add("active");
    document.getElementById("txt_reset_filter_bottom").classList.remove("inactive");
}
function backtoFilter() {
    document.getElementById("selected_filter").innerText = "";
    document.getElementById("modal_body_top").classList.remove("active");
    document.getElementById("modal-header").classList.remove("active");
    document.getElementById("filter_modal_body_bottom").classList.remove("active");
    document.getElementById("txt_reset_filter_bottom").classList.remove("inactive");
}
document.addEventListener("click", function (event) {
    let val = document.querySelector('input[name="sort_by"]:checked').value;
    let val1 = document.querySelector('input[name="sort_order"]:checked').value;
    if (val1 == "Ascending" && val == "Product ID") {
        var attr = document.createAttribute("disabled");
        var h = document.getElementById("txt_reset");
        h.setAttributeNode(attr);
    } else {
        if ((val == "Name" || val == "Supplier" || val == "Weight" || val == "Price")) {
            document.getElementById("txt_reset").removeAttribute("disabled");
        } else if (val1 == "Descending") {
            document.getElementById("txt_reset").removeAttribute("disabled");
        }
    }
});
/* Modal Radio button checked Reset button enable - End*/