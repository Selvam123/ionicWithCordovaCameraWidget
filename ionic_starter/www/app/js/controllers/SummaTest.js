/**
 *
 * @author Schubert Generated Code</br>
 * Date Created: </br>
 * @since  </br>
   build:   </p>
 *
 * code was generated by the Schubert System </br>
 * Schubert system Copyright - NewPortBay LLC copy_right_range</br>
 * The generated code is free to use by anyone</p>
 *
 *
 *
*/

app.controller("SummaTest", [ '$scope', '$rootScope', '$location', '$window', '$q', '$http', '$cordovaSQLite', '$cordovaCamera','$cordovaFileTransfer','$timeout',
				    function( $scope, $rootScope, $location, $window, $q, $http, $cordovaSQLite, $cordovaCamera,$cordovaFileTransfer,$timeout) {

		$scope.SummaNoun = {
		id: '',
		name : '', 
		degree : '', 
		dateofjioning : '', 
		profilepic : '', 
		ctc : '', 
		mic : '',
		imagedata:''
		};



        $scope.takePhoto = function () {

		  //this is where the start code goes
 
		  	 alert("in take picture")  ;
		  		navigator.camera.getPicture(cameraSuccess, cameraError, {
		  		quality: 50,
		  		destinationType: Camera.DestinationType.FILE_URL
		  		});
		  		}
		  		function cameraSuccess(fileURI){
		  		 console.log("----fileURI--",fileURI);
		  		 alert(fileURI);
		  		 $scope.SummaNoun.profilepic= fileURI;
		  		 }
		  		 function cameraError(message){
		  		 // load some default image here
		  		 alert('Failed because: ' + message);
		  		 };
		  		 function clearCache() {
		  		 navigator.camera.cleanup();
		  		 }
		  		 function onFail(message) {
		  		 alert('Failed because: ' + message);

        };

 $scope.create = function () {
 
		  var query = "INSERT INTO SummaNoun(name,degree,dateofjioning,profilepic,ctc,mic) VALUES(?,?,?,?,?,?)";
		  //var query = "INSERT INTO SummaNoun(profilepic) VALUES("+c+")";
		  alert("to do create");

		  if($scope.SummaNoun!='' && $scope.SummaNoun!= undefined){ 
		  $cordovaSQLite.execute($rootScope.db, query,[$scope.SummaNoun.name,$scope.SummaNoun.degree,$scope.SummaNoun.dateofjioning,$scope.SummaNoun.profilepic,$scope.SummaNoun.ctc,$scope.SummaNoun.mic]).then(function(res) {
		  var message = "INSERT ID -> " + res.insertId;
		  $scope.SummaNoun.id = res.insertId;
		  console.log(message);
		  alert(message);
		  //$scope.imageUpload();
		  }, function (err) {
		  console.error(err);
		  alert(err);
		  });
		  }
         };

 

       
        $scope.pushToCloud = function(){
		var fileURL = '';
        console.log("---in push to live function---"); 
		 var syncURL ="http://45.55.156.148:8080/MobileSync/SummaTest/uploadFile"; 
    	var surveyResultsQuery = "SELECT * FROM SummaNoun"; 
    	var result = $cordovaSQLite.execute($rootScope.db,surveyResultsQuery,[]);
		result.then(
			 function(res) {
			 	console.log("---response function---");
			 if(res.rows.length > 0) {
			 surveyResultrecords=[];
				for(var i=0; i<res.rows.length; i++){		
					surveyResultrecords.push(res.rows.item(i));					
				}
				//alert(syncURL);
				console.log("records............."+angular.toJson(surveyResultrecords.length));
				if(surveyResultrecords.length>0){ 
					angular.forEach(surveyResultrecords, function(value, key){
					console.log("---surveyResultrecords---",value);
					//alert(angular.toJson(value));
					fileURL=value.profilepic;  
  		   			var imageURL = fileURL;
  		     		var id=value.id;
				    console.log("id to pass for ajax call",id);
				    console.log("ajaxcall"); 
 			 		var uri = syncURL;

		   var options = new FileUploadOptions();
		   options.fileKey = "uploadfile";
		   options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
		   options.mimeType = "image/jpeg";
		   options.chunkedMode = false;  
  		   var ft = new FileTransfer(); 
		   var test = ft.upload(imageURL, encodeURI(uri), onSuccess, onError, options);  

		    function onSuccess(r) { 
		      console.log("code==="+ angular.toJson(r))
		      console.log("Response = " + r.response);
			  var res = r.response.split("\":"); 
			  res = res[3].split("\"}"); 
			  res = res[0].split("\\") 
			  res = res[0]+"\""; 
			  res = res.split(","); 
			  console.log("Response now   = " + res);
			  var result =  $scope.ajaxcall(id); 
			   alert("Image Sent to live db ");
		   }

		   function onError(error) {
		      alert("An error has occurred: Code = " + error.code);
		      alert("An error has occurred: Code = " + angular.toJson(error));
		      console.log("upload error source " + error.source);
		      console.log("upload error target " + error.target);
		   }
 	});
 				}else{
					console.log("No results to sync");
					alert("No results to sync");
					}
				
			} else {
				console.log("No results found");
				alert("No results found"); 
			}				
		 }); 
	};




$scope.ajaxcall = function(id){
		console.log("in ajax cal received id()",id);
		var syncURL = "http://45.55.156.148:8080/MobileSync/SummaTest/update_SummaNoun";
				var surveyResultrecords =[];
				   var query = "SELECT * FROM SummaNoun WHERE id="+id+";"; 
				  $cordovaSQLite.execute($rootScope.db, query,[]).then(function(res) {
			 if(res.rows.length > 0) {
			 	console.log("inside the if loop")
		  	for (var i = 0; i < res.rows.length; i++) {
		  			console.log(" for loop-----")
		 		 	surveyResultrecords = angular.toJson(res.rows.item(i)); 
		  			console.log(surveyResultrecords); 
				  	var finalData=JSON.parse(surveyResultrecords);
				  	console.log('final data',angular.toJson(finalData));
				  	console.log(angular.toJson(finalData.profilepic)); 
			 finalData.profilepic = ""; 
			console.log("data---",angular.toJson(finalData));  
	$http({
		method: 'POST', 
		url: syncURL,
		data: angular.toJson(finalData),
		 }).then(function(result){
				        	console.log( "yay---" +JSON.stringify(result.data)); 
											return "data Updated"; 
				        }).then(function(ress){
								console.log("PUSH completed ");
								alert("push completed")
				        }); 
		  	};  
}; 
});
//end of for loop 
}


        $scope.get_all_values = function () {

		  //this is where the start code goes

		  //this is where the validate code goes

		  //this is where the confirm code goes

		  //this is where the post code goes 
		 var query = "SELECT * FROM SummaNoun;";
		  $cordovaSQLite.execute($rootScope.db, query,[]).then(function(res) {
		   if(res.rows.length > 0) {
		  for (var i = 0; i < res.rows.length; i++) {
		  var message = res.rows.item(i).profilepic;
		  console.log(res.rows.item(i));
		  alert(message);
		  };
		  } else {
		   alert("No results found");
		  console.log("No results found");
		  }
		  }, function (err) {
		  console.error(err);
		  alert(err);
		  });

	/*	 var testURL  =  "http://45.55.156.148:8080/Testcamera/SummaTest/get_all_SummaNoun"
		  $http({method: 'GET', url: testURL						
				        })
			            .success(function(res){
											console.log( "get All values" +JSON.stringify(res));
											if(res.length > 0) {
												  for (var i = 0; i < res.length; i++) {
												  var message = res[i].name;
												  console.log("result--",res);
												  //console.log("msg--",message);//
												  alert(message);
												  };
												}
											 //return deferred.promise;
						})
				        .error(function (error, status){
							console.log(error+status);   
						});*/


		  //this is where the server response code goes

		  //this is where the display server response code goes

		  //this is where the transition code goes

		  //this is where the end code goes


        };




		$scope.datepickerObject_Date_2358 = {
			titleLabel: 'Pick date',
			inputDate: new Date(),
			mondayFirst: true,
			showTodayButton: 'true',
			callback: function (val) {
				datePickerCallback(val);
			}
		};
		var datePickerCallback = function (val) {
			if (typeof(val) === 'undefined') {
				console.log('No date selected');
			} else {
				console.log('Selected date is : ', val)
				$scope.datepickerObject_Date_2358.inputDate = val;
				$scope.SummaNoun.dateofjioning = val;
			}
		};

}]);


