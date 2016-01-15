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
var pageType = PAGE_TYPE_HAVLE; //打印纸张类型

//发货单单号信息
var PARAM_TITLE = '';
var PARAM_PSMB = '';
var PARAM_DHRQ = '';
var PARAM_PSLX = '';
var PARAM_FHDH = '';
var PARAM_ZDRQ = '';

function makeData(){
	var dataSize = 40;
	var lineData = [];
	var detailData = [];

	PARAM_TITLE = '成都市58度食品有限公司预配发货单';
	PARAM_PSMB = '原物料需求好长好长好长好长好长好长asdasd-sdfksldf,.sdfsdfsdf';
	PARAM_DHRQ = '2015-06-01至2015-06-04';
	PARAM_PSLX = '成都一线,21,test111,BEIJINGMOUQU,cs20151224';
	PARAM_FHDH = 'YP201505290001';
	PARAM_ZDRQ = '2015-06-01';

	
	//线路数据
	lineData = [
		{
			lineName: '成都一线成都一线成都一线成都一线成都一线成都一线',
			lineBranchs: {col1: '正式一正式一',col2: 'scm正式2'}
		}
	];
	detailData.push(
			{
				ssfl: '馅料',
				spbm: '0000004',
				spmc: '猪肉豆角馅',
				dw: '千克',
				hj: '10,000',
				col1: '100',
				col2: '100'
			}
	);
	detailData.push(
			{
				ssfl: '馅料',
				spbm: '0000004',
				spmc: '猪肉豆角馅',
				dw: '千克',
				hj: '10,000',
				col1: '100',
				col2: '100'
			}
	);

	//商品发货数据
	for (var i = 0; i < dataSize; i++) {
		var rowData = {
			ssfl: '原物料原物料原物料原物料原物料原物料原物料原物料原物料原物料原物料原物料原物料原物料原物料原物料原物',
			spbm: '123456789012',
			spmc: '伊利优酸乳(250ml)好sdasd-sdfksldf,.sdfsdfsdf长好长',
			dw: '千克',
			hj: '10,000',
			col1: '100',
			col2: '100'
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

	var isFirstPage = true;
	for (var i = 0; i < pageHeadGroup.length; i++) {
		var line = pageHeadGroup[i];
		var detail = pageDetailGroup[i];
		var isNextGroup = true; //是否是下一分组


		while(detail.length > 0){
			if(isFirstPage || isNextGroup){
				//填充一页
				var page = {
					showTitle: isFirstPage,
					title: PARAM_TITLE,
					psmb: PARAM_PSMB,
					dhrq: PARAM_DHRQ,
					pslx: PARAM_PSLX,
					fhdh: PARAM_FHDH,
					zdrq: PARAM_ZDRQ,
					line: line,
					pageStyle: pageType,
					detail: detail[0]
				};

				var pageHtml = template('printPage', page);
				
				$('.print-area').append($(pageHtml));

				detail.shift();
				isFirstPage = false;
				isNextGroup = false;
				continue;
			}else{
				//添加页明细
				var rowHtml = template('detail-body', detail[0]);
				$('.print-page:last>table tr.detail:last').after($(rowHtml));

				//页内容超出时删除最后一个添加的行
				var isOverFlow = ( $('.print-page:last>table').height() + $('.page-footer:last').height() > $('.print-page:last').height() ); //判断高度是否超出
				if(isOverFlow){
					$('.print-page:last>table tr.detail:last').remove();

					//填充一页
					var page = {
						showTitle: isFirstPage,
						title: PARAM_TITLE,
						psmb: PARAM_PSMB,
						dhrq: PARAM_DHRQ,
						pslx: PARAM_PSLX,
						fhdh: PARAM_FHDH,
						zdrq: PARAM_ZDRQ,
						line: line,
						pageStyle: pageType,
						detail: detail[0]
					};

					var pageHtml = template('printPage', page);
					
					$('.print-area').append($(pageHtml));

					isFirstPage = false;
					isNextGroup = false;
				}
				detail.shift();
			}

		}
	}

}

function fullPage(){
	makePageData();
	var pageCount = $('.page-footer').length;
	$('.page-footer').each(function(i){
		$(this).text(i + 1 + '/' + pageCount);
	});
}

function fullPageWithPageType(){
    fullPage();
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