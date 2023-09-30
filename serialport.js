// 1. 의존성 라이브러리 import
// serialport 라이브러리의 SerialPort 클래스와 parser-readline 모듈의 ReadlineParser 클래스를 임포트
const {SerialPort} = require('serialport');
const {ReadlineParser} = require('@serialport/parser-readline');


// 2. 시리얼 포트 설정
// SerialPort 클래스를 사용하여 시리얼 포트를 설정
// COM4" 포트를 사용, 전송 속도는 9600 bps
const port = new SerialPort({
    path: 'COM4',
    baudRate: 9600
});


// 3. 데이터 파서 설정
// ReadlineParser 클래스를 사용하여 데이터를 줄 단위로 파싱하는 파서를 생성
// 파서는 port 객체의 데이터 스트림을 파이핑
// '\r\n'를 구분자로 사용하여 데이터를 줄 단위로 분리
const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}));


let buffer = '';


// 4. 데이터 이벤트 처리
// port 객체의 'data' 이벤트를 처리하는 콜백 함수를 등록
// 데이터를 읽을 때마다 콜백 함수 호출. 현재 코드에서는 데이터를 그대로 콘솔에 출력
port.on('data', function(data){

    buffer += data.toString(); // 수신한 데이터 버퍼에 추가

    const sentences = buffer.split('\r\n');

    // 문장 단위로 처리
    for (let i = 0; i < sentences.length -1; i++) {
        const sentence = sentences[i].trim(); // 앞뒤 문장 공백 제거

        // 데이터 분리 : 풍향, 풍속
        if(sentence.startsWith('$WIMWV')) {
            const data = sentence.split(',');

            if (data.length >= 4) {
                const windDirection = data[1].trim();
                const windSpeed = data[3].trim();

                console.log('풍향:', windDirection,'/ 풍속:', windSpeed,'(m/s)' );
                // console.log('풍속: ', windSpeed);
                
            }
       }

    }
    
    // 마지막 문장을 다음 처리를 위해 버퍼에 남김
    buffer = sentences[sentences.length -1]; 
});

