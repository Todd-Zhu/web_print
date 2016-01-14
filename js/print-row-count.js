//每页能显示的最大行数
var PAGE_ROW_COUNT = 0;
//第一页title占用行数
var PAGE_TITLE = 2;
//第一页显示的最大行数
var PAGE_FIRST_BEST = 0;
//门店最大栏位
var STORE_BEST_COUNT = 8;
//打印纸张类型
var PAGE_TYPE_A4 = 'A4';
var PAGE_TYPE_HAVLE = 'stylus';

//发货单单号信息
var PARAM_TITLE = '';
var PARAM_PSMB = '';
var PARAM_DHRQ = '';
var PARAM_PSLX = '';
var PARAM_FHDH = '';

function makeData(){
	var dataSize = 20;
	var lineData = [];
	var detailData = [];

	PARAM_TITLE = '成都市58度食品有限公司预配发货单';
	PARAM_PSMB = '原物料需求要货好长好长好长好长好长好长好长好长好长好长';
	PARAM_DHRQ = '2015-06-01至2015-06-04';
	PARAM_PSLX = '成都一线好长好长好长好长好长好长好长好长好长好长';
	PARAM_FHDH = 'YP201505290001';

	
	//线路数据
	lineData = [
		{
			lineName: '成都一线',
			lineBranchs: {col1: '成都一店',col2: '成都一店',col3: '成都一店',col4: '成都一店',col5: '成都一店',col6: '成都一店'}
		},{
			lineName: '成都二线',
			lineBranchs: {col7: '成都一店',col8: '成都一店',col9: '成都一店',col10: '成都一店',col11: '成都一店',col12: '成都一店'}
		},{
			lineName: '成都三线',
			lineBranchs: {col3: '成都一店',col14: '成都一店',col5: '成都一店'}
		}
	];

	//商品发货数据
	for (var i = 0; i < dataSize; i++) {
		var rowData = {
			ssfl: '奶制品类品',
			spbm: '123456789012',
			spmc: '伊利优酸乳(250ml)长好长好长好长好长好长好长好长好长',
			dw: '千克',
			hj: '10,000',
			col1: '100',
			col2: '100',
			col3: '100',
			col4: '100',
			col5: '100',
			col6: '100',
			col7: '100',
			col8: '100',
			col9: '100',
			col10: '100',
			col11: '200',
			col12: '300',
			col13: '400',
			col14: '500',
			col15: '600'
		};
		detailData.push(rowData);
	}

	return {lineData: lineData,detailData: detailData};
}

function bulidData(){
	var sourceData = makeData();
	var lineData = sourceData.lineData;
	var detailData = sourceData.detailData;

	//-----------做成表头分组数据-------------
	var pageHeadGroup = [];
	var pageHead = {lines: [], branchs: []};
	var lineObj = {name: '', branchsCount: 0};

	for (var i = 0; i < lineData.length; i++) {
		var line = lineData[i];
		var branchs = line.lineBranchs;

		for(key in branchs){
			lineObj.name = line.lineName;
			lineObj.branchsCount += 1;

			pageHead.branchs.push(branchs[key]);

			delete branchs[key];

			if(objKeys(branchs).length == 0 && pageHead.branchs.length != STORE_BEST_COUNT){
				pageHead.lines.push(lineObj);
				lineObj = {name: '', branchsCount: 0};

				if(i == lineData.length - 1){
					//最后一条
					pageHeadGroup.push(pageHead);
				}
			}

			if(pageHead.branchs.length == STORE_BEST_COUNT){
				pageHead.lines.push(lineObj);
				//添加一组表头数据
				pageHeadGroup.push(pageHead);

				//初始化新的表头数据
				pageHead = {lines: [], branchs: []};
				lineObj = {name: '', branchsCount: 0};
			}
		}
	}

	//最后组表头补全STORE_BEST_COUNT条
	var lastPageHead = pageHeadGroup[pageHeadGroup.length-1];
	var lastPageBranchsCount = 0;
	for (var i = 0; i < lastPageHead.lines.length; i++) {
		lastPageBranchsCount += lastPageHead.lines[i].branchsCount;
	}
	if(lastPageBranchsCount != STORE_BEST_COUNT){
		lineObj.name = '';
		lineObj.branchsCount = STORE_BEST_COUNT - lastPageBranchsCount;

		var branchObj = new Array(lineObj.branchsCount);
		lastPageHead.lines.push(lineObj);
		lastPageHead.branchs = lastPageHead.branchs.concat(branchObj);
	}

	//------------------做成表身体数据--------------------
	var pageDetailGroup = [];
	for (var i = 0; i < pageHeadGroup.length; i++) {
		var NOT_COL_NUMBER = 5;
		var colNumerStart = 0;
		var colNumerEnd = STORE_BEST_COUNT-1 + NOT_COL_NUMBER;

		var newRow = [];

		for (var j = 0; j < detailData.length; j++) {
			var row = detailData[j];
			var rowKeys = objKeys(row);

			var rowData = {
				ssfl: '',
				spbm: '',
				spmc: '',
				dw: '',
				hj: '',
				col1: '',
				col2: '',
				col3: '',
				col4: '',
				col5: '',
				col6: '',
				col7: '',
				col8: ''
			};

			for (var k = colNumerStart; k <= colNumerEnd; k++) {
				var rowDataKeys = objKeys(rowData);
				rowData[rowDataKeys[k]] = row[rowKeys[k]] || '';

				if(k >= NOT_COL_NUMBER){
					delete row[rowKeys[k]];
				}
			}

			newRow.push(rowData);
			
		}

		pageDetailGroup.push(newRow);
	}

	return {pageHeadGroup: pageHeadGroup, pageDetailGroup: pageDetailGroup};
}

function makePageData(){
	var sourceData = bulidData();
	var pageHeadGroup = sourceData.pageHeadGroup;
	var pageDetailGroup = sourceData.pageDetailGroup;

	var pageData = []; //所有页数据
	for (var i = 0; i < pageHeadGroup.length; i++) {
		var line = pageHeadGroup[i];
		var detail = pageDetailGroup[i];

		while(detail.length > 0){
			var isFirstPage = (pageData.length == 0);
			var pageDetail = [];

			if(isFirstPage){
				pageDetail = detail.splice(0,PAGE_FIRST_BEST);
			}else{
				pageDetail = detail.splice(0,PAGE_ROW_COUNT);
			}

			var page = {
				showTitle: isFirstPage,
				title: PARAM_TITLE,
				psmb: PARAM_PSMB,
				dhrq: PARAM_DHRQ,
				pslx: PARAM_PSLX,
				fhdh: PARAM_FHDH,
				line: line,
				detail: pageDetail
			};

			pageData.push(page);
		}
	}

	//添加页数
	for (var i = 0; i < pageData.length; i++) {
		pageData[i].pageIndex = i+1;
		pageData[i].pageCount = pageData.length;
	}

	return {pages: pageData};
}

function fullPage(){
    PAGE_FIRST_BEST = PAGE_ROW_COUNT - PAGE_TITLE; //重新计算第一页的最大数

    var data = makePageData();
    var pageHtml = template('printPage', data);

    $('.print-area').html(pageHtml);
}

function fullPageWithPageType(){
	var pageType = PAGE_TYPE_A4;

    if(pageType == PAGE_TYPE_A4){
        PAGE_ROW_COUNT = 40;
        fullPage();
    }else{
        PAGE_ROW_COUNT = 12;
        fullPage();
        $(".print-page").css({height:'400px'});
    }
}
fullPageWithPageType();

function myprint(){
    if(window.ActiveXObject){
        wb.ExecWB(7,1);
    }else{
        window.print();
    }
}

function objKeys(obj){
	var keys = [];
	if (typeof obj == 'object') {
		for(key in obj){
			keys.push(key);
		}
	}
	return keys;
}