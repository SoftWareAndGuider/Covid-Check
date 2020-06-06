# Covid-Check
코로나 바이러스 확산으로 인한 장곡중 발열체크&amp;조회 시스템

이 프로그램의 클라이언트는 [여기](https://github.com/softwareandguider/covid-check-client) 에서 확인할 수 있습니다

## 설치
설치 하기 전 다음의 요구사항이 전부 만족하는지 확인합니다:
* `git (v2.x or newer)`
* `node (v12.x or newer)`
* `npm (v6.x or newer)` 또는 `yarn (v1.x only)`
* `mariadb (v15.x or newer)`

### 코드 다운로드
이 레포지트리를 클론합니다:
```sh
git clone https://github.com/SoftWareAndGuider/Covid-Check.git
cd Covid-Check
```

### 구성요소 다운로드
`npm`혹은 `yarn`을 통해 구성요소를 다운로드 합니다:
```sh
npm install
```
혹은:
```
yarn install
```

### 데이터베이스 구성
`mariadb` 데이터베이스를 구성합니다:
```sql
-- root 계정으로 connect한 후 다음을 입력:
source ./database.sql
```

### 실행
`node`를 사용하여 웹 서버를 실행합니다:
```sh
sudo CvCheckPort=80 node index.js
```

### 완료
`:80` 포트로 웹 서버가 실행되었습니다\
보안을 위해 프록시를 통해 `ssl`을 적용하는 것을 추천합니다

## 저작권
&copy; 모든 저작권은 (칠곡) 장곡중학교와 Software And Guiders(SWAG, 장곡중 소프트웨어 동아리)에 있으며, 무단 복제 및 2차 배포를 금합니다
원문은 [여기](/LICENSE)를 참고하십시오
```
1. 이 프로그램은 원 저작자가 허용한 경우를 제외하고 어떠한 경우에도 상업적, 영리적으로 이용될 수 없다.
2. 이 프로그램의 소스중 일부 혹은 전체를 사용한 경우 상업적, 영리적으로 이용될 수 없다.
3. 이 프로그램의 아이디어를 이용한 2차 저작물 또한 상업적, 영리적으로 이용될 수 없다.
4. 이 프로그램을 수정 및 2차 배포 할 경우 원 저작자 표기 방침을 따라야 한다.
5. 이 프로그램의 아이디어를 이용한 2차 저작물을 제작 및 2차 배포 할경우, 또한 원 저작자 표기 방침을 따라야 한다.
6. 이 프로그램 혹은 이 프로그램의 수정본을 사용할 때에는 SSL암호화 등의 보안된 환경에서 실행되어야 한다.
7. 이 프로그램의 수정본을 제작해 배포할 경우 추가적인 조항을 추가 할 수 있다. (단 기존의 조항을 수정, 삭제 혹은 기존의 조항에 반하는 내용의 조항 추가는 금한다.)
```
