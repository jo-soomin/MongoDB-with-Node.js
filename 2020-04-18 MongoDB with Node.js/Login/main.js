var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/login');
var db = mongoose.connection;
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('Connected!');
});

var member = mongoose.Schema({
    id : 'string',
    pw : 'string'
},{
	versionKey : false 
	
}
);
var Member = mongoose.model('member', member);


var app = http.createServer(function(request, response){
	var url_ = request.url;
	var queryData = url.parse(url_, true).query;
	var pathname = url.parse(url_, true).pathname;
	console.log(pathname);
	
	if(pathname==='/'){
			
			var home = `
				<h1>Home</h1>
				
				<form action="/login" method="post">
					<input type="text" name="id" placeholder="id를 작성하세요."><br> 
					<input type="text" name="pw" placeholder="패스워드를 작성하세요."><br>
					<a href="/sign">회원가입</a>
					<input type = "submit" value="로그인하기">
				</form>
			`;
			response.writeHead(200,{'Content-Type': 'text/html; charset=UTF-8'}); // 한글깨짐을 방지하기 위해 인코딩 해주는 것.
			response.end(home);
	}else if(pathname==='/login'){
		var body ='';
		request.on('data', function(data) {
			body = body+data;
		});
		request.on('end', function(){
			var post = qs.parse(body);
			console.log(post);
			var postid = post.id;
			var postpw = post.pw;
			var mypage =`
				<h1>${post.id} 님의page</h1>
				`;
		
		Member.findOne({id:postid, pw:post.pw}, function(error,member){
			if(error){
				console.log(error);
				 response.writeHead(200,{'Content-Type': 'text/html; charset=UTF-8'}); 
			     response.end("error");
			}else if(member===null){
				response.writeHead(200,{'Content-Type': 'text/html; charset=UTF-8'}); 
			    response.end("아이디 패스워드 확인");
			}else{
				console.log(member);
				response.writeHead(200,{'Content-Type': 'text/html; charset=UTF-8'}); 
				response.end(mypage);
				
			}
		});
	});

	}else if(pathname==='/sign'){
		var signup = `
			<h1>회원가입</h1>
			
			<form action="/signRes" method="post">
					<input type="text" name="id" placeholder="id를 작성하세요." required=true><br> 
					<input type="text" name="pw" placeholder="패스워드를 작성하세요." required=true><br>
					<input type="submit" value="회원가입하기">
				</form>
		`;
		response.writeHead(200,{'Content-Type': 'text/html; charset=UTF-8'}); 
		response.end(signup);
		
	}else if(pathname ==='/signRes'){
		var body = '';
		request.on('data', function(data){
			body = body+data;
		});
		request.on('end', function(){
			var post = qs.parse(body);
			var id = post.id;
			var pw = post.pw;
			console.log(post);
			
		
		var newMember = new Member({id:id, pw:pw});
		
		newMember.save(function(error, data){
		    if(error){
		        console.log(error);
		        response.writeHead(404, {Location: `/`});// 302 : 페이지를 다른 곳으로 redirect 해라 
		        response.end();
		    }else{
		        console.log('회원가입완료')
		        response.writeHead(302, {Location: `/`});// 302 : 페이지를 다른 곳으로 redirect 해라 
		        response.end();
		    }
		});
	});
		
	}
});

app.listen(3000);