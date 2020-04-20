// 1. mongoose 모듈 가져오기
var mongoose = require('mongoose');
// 2. testDB 세팅
mongoose.connect('mongodb://127.0.0.1:27017/mongdb_tutorial');
// 3. 연결된 testDB 사용
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('Connected!');
});

//6. collection을 위한 스키마 생성 
var student = mongoose.Schema({
    name : 'string',
    address : 'string',
    age : 'number'
});


// 7. 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일 --> collection 생성
var Student = mongoose.model('test03', student);

//// 8. Student 객체를 new 로 생성해서 값을 입력 --> 스키마에 정의된 document만 사용가능
var newStudent = new Student({name:'조수민', address:'서울', age:27}); 

// 9. 데이터 저장
newStudent.save(function(error, data){
    if(error){
        console.log(error);
    }else{
        console.log('Saved!')
    }
});

////10. Student 레퍼런스 전체 데이터 가져오기
//Student.find(function(error, students){
//    console.log('--- Read all ---');
//    if(error){
//        console.log(error);
//    }else{
//        console.log(students);
//    }
//})

//// 11. 특정 document의 값 불러오기
Student.findOne({name:'조수민'}, function(error,student){
    console.log('--- Read one ---');
    if(error){
        console.log(error);
    }else{
        console.log(student);
    }
});

////12. 특정 document값 수정하기
//Student.findOne({name:'test'}, function(error,student){
//    console.log('--- Update(PUT) ---');
//    if(error){
//        console.log(error);
//    }else{
//        student.age = 37;
//        student.save(function(error,modified_student){
//            if(error){
//                console.log(error);
//            }else{
//                console.log(modified_student);
//            }
//        });
//    }
//});
//
////13. 삭제
//Student.remove({name:'test'}, function(error,output){
//    console.log('--- Delete ---');
//    if(error){
//        console.log(error);
//    }
//
//    /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
//        어떤 과정을 반복적으로 수행 하여도 결과가 동일하다. 삭제한 데이터를 다시 삭제하더라도, 존재하지 않는 데이터를 제거요청 하더라도 오류가 아니기 때문에
//        이부분에 대한 처리는 필요없다. 그냥 삭제 된것으로 처리
//        */
//    console.log('--- deleted ---');
//});