/*
I want to thank Paul Rudnitskiy for his idea.
If you need full work version you can download it here  https://github.com/BlackStar1991/CardProduct
*/
var AllHotels = {};
var Distance_Only = {};
var Curr_Hotel_List = {};

function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist * 1.609344
	}
}

function setRating(R){
    var F = Math.floor(R);
    var Res = '<span class="fa fa-star checked"></span>'.repeat(F);
    if(F!=R)
        Res += '<span class="fa fa-star-half-full checked"></span>';
    Res += '<span class="fa fa-star"></span>'.repeat(5-F-(F!=R));
    
    return Res;
}

function setHotel(data,All){
    data.sort(function(a,b){
        return a[0] > b[0] ? 1 : -1;
    });
    data = data.slice(0,25);
    
    window.Curr_Hotel_List = {};
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ data[i][0].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
      $('#Hotel-List').append(T);
    });

    document.getElementById("loader").style.display = "none";
    document.getElementById("Sort-and-filter").style.display = "block";
    
}

function recommendedHotel(position){
    firebase.database().ref("/Hotels").once("value", function(snapshot) {
        window.AllHotels = snapshot.val();
        window.Curr_Hotel_List = window.AllHotels; 
        var data = [];
        for (var key in window.AllHotels) {
            var Rating =0;
            var RatingCount=0;
            if(All[key]["tad_review_rating"]=="")
                Rating=0;
            else
                Rating=parseInt(All[key]["tad_review_rating"]);
            if(All[key]["tad_review_count"]=="")
                RatingCount=0;
            else
                RatingCount=parseInt(All[key]["tad_review_count"]);
            if(Rating*RatingCount==0)
                window.AllHotels[key]["Price"]= Rating*100+RatingCount;
            else
                window.AllHotels[key]["Price"]= getRndInteger(100,500);
            var str = window.AllHotels[key]["tripadvisor_seller_rating"];
            var matches = str.match(/(\d+)/); 
            if (matches)
                window.AllHotels[key]["tripadvisor_seller_rating"] =parseInt(matches[0]);
            else
                window.AllHotels[key]["tripadvisor_seller_rating"] = 0;
            window.AllHotels[key]["Distance"]=distance(position.coords.latitude, position.coords.longitude,window.AllHotels[key]["latitude"], window.AllHotels[key]["longitude"]);
          data.push([parseFloat(window.AllHotels[key]["Distance"]),key]);
        }
        setHotel(data,window.AllHotels);
      });
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function SearchHotelD(){
    navigator.geolocation.getCurrentPosition(SearchHotel);
}

function SearchHotel(position){
    
    document.getElementById("myModal").style.display = "block";
    document.getElementById("message").innerText = "Searching...";
    document.getElementById('btn-ok').style.display = "none";
    var City_Name = document.getElementById("Search-City-Field").value;
    
        $("#Hotel-List").html("");
        window.Curr_Hotel_List = AllHotels;
        var i=0;
        for (var key in AllHotels) {
            if(AllHotels[key]["city"].toLowerCase().indexOf(City_Name.toLowerCase()) != -1){
                var Dist = distance(
                position.coords.latitude, position.coords.longitude, AllHotels[key]["latitude"], AllHotels[key]["longitude"]);
                var Rating = parseFloat(AllHotels[key]["tad_review_rating"]);
                if(AllHotels[key]["tad_review_rating"]=="")
                    Rating=0;
                var Rate = setRating(Rating);
                var Reviews = parseInt(AllHotels[key]["tad_review_count"]);
                if(AllHotels[key]["tad_review_count"]=="")
                    Reviews=0;
                var L = AllHotels[key]["image_urls"].split("|");
                var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
                for (x=0;x<L.length;x++){
                    IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
                }
                IMG += '</ul></div></div></div>';


                var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ AllHotels[key]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + AllHotels[key]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + AllHotels[key]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ AllHotels[key]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ AllHotels[key]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ AllHotels[key]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ Dist +'</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
                $('#Hotel-List').append(T);
                i+=1;
                if(i>100)
                    break;
            }
        }
        
        document.getElementById("myModal").style.display = "none";
}

window.onload = function () {
    
    document.getElementById("Sort-and-filter").style.display = "none";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(recommendedHotel);
    } else { 
        this.alert("Error Location is Requared");
        x.innerHTML = "Geolocation is not supported by this browser.";
        document.getElementById("Sort-and-filter").style.display = "block";
    }
};

function SortBy(){
    SortByText = "";
    L =  document.getElementsByName("sort");
    for(i=0;i<L.length;i++)
        if(L[i].checked)
            SortByText = L[i].value;
    if(SortByText=="Our_Recommendations"){
        SortBy_Our_Recommendations();
    }
    if(SortByText=="Rating_Recommended"){
        SortBy_Rating_Recommended();
    }
    if(SortByText=="Price_Recommended"){
        SortBy_Price_Recommended();
    }
    if(SortByText=="Distance_Recommended"){
        SortBy_Distance_Recommended();
    }
    if(SortByText=="Rating_Only"){
        SortBy_Rating_Only();
    }
    if(SortByText=="Price_Only"){
        SortBy_Price_Only();
    }
    if(SortByText=="Distance_Only"){
        SortBy_Distance_Only();
    }
}

function SortBy_Our_Recommendations(){
    document.getElementById("Hotel-List").innerHTML="";
    document.getElementById("loader").style.display = "block";
    var City_Name = document.getElementById("Search-City-Field").value;
    if(City_Name==null || City_Name=='')
        All = window.AllHotels;
    else
        All = window.Curr_Hotel_List;
    data=[];
    for (var key in All) {
        var Rating =0;
        var RatingCount=0;
        if(All[key]["tad_review_rating"]=="")
            Rating=0;
        else
            Rating=parseInt(All[key]["tad_review_rating"]);
        if(All[key]["tad_review_count"]=="")
            RatingCount=0;
        else
            RatingCount=parseInt(All[key]["tad_review_count"]);
        data.push([All[key]["Distance"],key,All[key]["tripadvisor_seller_rating"]]);
    }
    data.sort(function(a,b){
        return a[0] > b[0] ? 1 : -1;
    });
    data = data.slice(0,500);
    data.sort(function(a,b){
        return a[2] < b[2] ? 1 : -1;
    });
    data = data.slice(0,100);
    
    window.Curr_Hotel_List = {};
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ data[i][0].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
        $('#Hotel-List').append(T);
    });

    document.getElementById("loader").style.display = "none";
}
function SortBy_Rating_Recommended(){
    document.getElementById("Hotel-List").innerHTML="";
    document.getElementById("loader").style.display = "block";
    var City_Name = document.getElementById("Search-City-Field").value;
    if(City_Name==null || City_Name=='')
        All = window.AllHotels;
    else
        All = window.Curr_Hotel_List;
    data=[];
    for (var key in All) {
        var Rating =0;
        var RatingCount=0;
        if(All[key]["tad_review_rating"]=="")
            Rating=0;
        else
            Rating=parseInt(All[key]["tad_review_rating"]);
        if(All[key]["tad_review_count"]=="")
            RatingCount=0;
        else
            RatingCount=parseInt(All[key]["tad_review_count"]);
        data.push([All[key]["Distance"],key,Rating*RatingCount,All[key]["Price"]]);
    }
    data.sort(function(a,b){
        return a[2] < b[2] ? 1 : -1;
    });
    data = data.slice(0,500);
    data.sort(function(a,b){
        return a[0] > b[0] ? 1 : -1;
    });
    data = data.slice(0,100);
    
    window.Curr_Hotel_List = {};
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ data[i][0].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
        $('#Hotel-List').append(T);
    });

    document.getElementById("loader").style.display = "none";    
}
function SortBy_Price_Recommended(){
    document.getElementById("Hotel-List").innerHTML="";
    document.getElementById("loader").style.display = "block";
    var City_Name = document.getElementById("Search-City-Field").value;
    if(City_Name==null || City_Name=='')
        All = window.AllHotels;
    else
        All = window.Curr_Hotel_List;
    data=[];
    for (var key in All) {
        var Rating =0;
        var RatingCount=0;
        if(All[key]["tad_review_rating"]=="")
            Rating=0;
        else
            Rating=parseInt(All[key]["tad_review_rating"]);
        if(All[key]["tad_review_count"]=="")
            RatingCount=0;
        else
            RatingCount=parseInt(All[key]["tad_review_count"]);
        data.push([All[key]["Distance"],key,Rating*RatingCount,All[key]["Price"]]);
    }
    data.sort(function(a,b){
        return a[0] > b[0] ? 1 : -1;
    });
    data = data.slice(0,500);
    data.sort(function(a,b){
        return a[3] < b[3] ? 1 : -1;
    });
    data = data.slice(0,100);
    
    window.Curr_Hotel_List = {};
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ data[i][0].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
        $('#Hotel-List').append(T);
    });

    document.getElementById("loader").style.display = "none";
}
function SortBy_Distance_Recommended(){
    document.getElementById("Hotel-List").innerHTML="";
    document.getElementById("loader").style.display = "block";
    var City_Name = document.getElementById("Search-City-Field").value;
    if(City_Name==null || City_Name=='')
        All = window.AllHotels;
    else
        All = window.Curr_Hotel_List;
    data=[];
    for (var key in All) {
        var Rating =0;
        var RatingCount=0;
        if(All[key]["tad_review_rating"]=="")
            Rating=0;
        else
            Rating=parseInt(All[key]["tad_review_rating"]);
        if(All[key]["tad_review_count"]=="")
            RatingCount=0;
        else
            RatingCount=parseInt(All[key]["tad_review_count"]);
        data.push([All[key]["Distance"],key,Rating*RatingCount,All[key]["Price"]]);
    }
    data.sort(function(a,b){
        return a[0] > b[0] ? 1 : -1;
    });
    data = data.slice(0,500);
    data.sort(function(a,b){
        return a[2] < b[2] ? 1 : -1;
    });
    data = data.slice(0,100);
    
    window.Curr_Hotel_List = {};
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ data[i][0].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
        $('#Hotel-List').append(T);
    });

    document.getElementById("loader").style.display = "none";
}
function SortBy_Rating_Only(){
    data = [];
    document.getElementById("Hotel-List").innerHTML="";
    document.getElementById("loader").style.display = "block";
    var City_Name = document.getElementById("Search-City-Field").value;
    if(City_Name==null || City_Name=='')
        All = window.AllHotels;
    else
        All = window.Curr_Hotel_List;
    for (var key in All) {
        var Rating =0;
        var RatingCount=0;
        if(All[key]["tad_review_rating"]=="")
            Rating=0;
        else
            Rating=parseInt(All[key]["tad_review_rating"]);
        if(All[key]["tad_review_count"]=="")
            RatingCount=0;
        else
            RatingCount=parseInt(All[key]["tad_review_count"]);
        data.push([Rating,key]);
      }
    data.sort(function(a,b){
        return a[0] < b[0] ? 1 : -1;
    });
    data = data.slice(0,50);
    
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+  All[data[i][1]]["Distance"].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
      $('#Hotel-List').append(T);
    });

    
    document.getElementById("loader").style.display = "none";
}
function SortBy_Price_Only(){
    data = [];
    document.getElementById("Hotel-List").innerHTML="";
    document.getElementById("loader").style.display = "block";
    var City_Name = document.getElementById("Search-City-Field").value;
    if(City_Name==null || City_Name=='')
        All = window.AllHotels;
    else
        All = window.Curr_Hotel_List;
    var i=0;
    for (var key in All)
        data.push([All[key]["Price"],key]);
    data.sort(function(a,b){
        return a[0] > b[0] ? 1 : -1;
    });
    data = data.slice(0,50);
    
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ data[i][0].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
      $('#Hotel-List').append(T);
    });

    
    document.getElementById("loader").style.display = "none";
}
function SortBy_Distance_Only(){
    
    data = [];
    document.getElementById("Hotel-List").innerHTML="";
    document.getElementById("loader").style.display = "block";
    var City_Name = document.getElementById("Search-City-Field").value;
    if(City_Name==null || City_Name=='')
        All = window.AllHotels;
    else
        All = window.Curr_Hotel_List;
    var i=0;
    for (var key in All) {
        data.push([All[key]["Distance"],key]);
      }
    data.sort(function(a,b){
        return a[0] < b[0] ? 1 : -1;
    });
    data = data.slice(0,50);
    
    $.each(data, function(i) {
        window.Curr_Hotel_List[data[i][1]]=All[data[i][1]];
        var Rating = parseFloat(All[data[i][1]]["tad_review_rating"]);
        if(All[data[i][1]]["tad_review_rating"]=="")
            Rating=0;
        var Rate = setRating(Rating);
        var Reviews = parseInt(All[data[i][1]]["tad_review_count"]);
        if(All[data[i][1]]["tad_review_count"]=="")
            Reviews=0;
        var L = All[data[i][1]]["image_urls"].split("|");
        var IMG = '<div class="Image_Layout"><div class="productCard_leftSide clearfix"><div class="sliderBlock"><ul class="sliderBlock_items">'
        for (x=0;x<L.length;x++){
            IMG += '<li class="sliderBlock_items__itemPhoto sliderBlock_items__showing"><img src="'+ L[x] + '"></li>';
        }
        
        IMG += '</ul></div></div></div>';
        
        var T = '<div class="Card_Layout">'+IMG+'<div class="Discription_Layout"><div class="productCard_rightSide"><div class="block_specification"><div class="block_specification__specificationShow"><i class="fa fa-cog block_specification__button block_specification__button__rotate"aria-hidden="true"></i><span class="block_specification__text">Description</span></div><div class="block_specification__informationShow hide"><i class="fa fa-info-circle block_specification__button block_specification__button__jump"aria-hidden="true"></i><span class="block_specification__text">Inform</span></div></div><p class="block_model"><span class="block_model__text">Property Id: </span><span class="block_model__number">'+ All[data[i][1]]["property_id"] +'</span></p><div class="block_product"><h2 class="block_name block_name__mainName">' + All[data[i][1]]["property_name"] +'</h2><h2 class="block_name block_name__addName">' + All[data[i][1]]["property_type"] + '</h2><p class="block_product__advantagesProduct">'+ All[data[i][1]]["room_type"] +'</p><div class="block_informationAboutDevice"><div class="block_descriptionCharacteristic block_descriptionCharacteristic__disActive"><div class="Description">'+ All[data[i][1]]["hotel_description"] +'</div></div><div class="block_descriptionInformation">'+ All[data[i][1]]["city"] +'</div><div class="block_rating clearfix"><fieldset class="block_rating__stars">'+ Rate +'</fieldset><span class="block_rating__avarage">'+ Rating +'</span><span class="block_rating__reviews">('+ Reviews +' reviews)</span></div><div class="block_price"><p class="block_price__currency">&#8377 '+AllHotels[data[i][1]]["Price"]+'</p><p class="block_Distance">'+ data[i][0].toFixed(2) +' K.M.</p></div><button class="button button_bookRoom">Book Now</button></div></div></div></div></div>';
        
      $('#Hotel-List').append(T);
    });

    
    document.getElementById("loader").style.display = "none";    
}