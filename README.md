# memo-cli

간편하고 직관적인 CLI 기반의 TODO(할 일) 관리 도구입니다.

## 프로젝트 소개

`memo-cli`는 개발자와 파워유저를 위한 커맨드라인 TODO 관리 툴입니다.

- 할 일 추가/수정/삭제/완료, 카테고리 및 태그 관리
- 직관적인 한글 출력
- 전역 어디서든 동일한 TODO 목록 사용(사용자 홈 디렉토리 기반 저장)
- 번호 또는 UUID로 할 일 접근 가능

## 설치 방법

### 1. 직접 빌드 및 설치

```bash
# 저장소 클론
$ git clone <이 저장소 주소>
$ cd todo-cli

# 의존성 설치
$ npm install

# 빌드
$ npm run build

# 패키지 바이너리 생성 (macOS 예시)
$ npm run package

# 바이너리를 PATH에 복사 (macOS 예시)
$ cp pkg/memo-macos ~/.bin/memo && chmod +x ~/.bin/memo
```

## 사용 방법

```bash
# 할 일 추가
$ memo add "리팩토링" -c "개발" -t "중요"

# 할 일 목록 조회
$ memo list
$ memo list --category 개발

# 할 일 완료 (번호 또는 ID)
$ memo done 1
$ memo done 0e7c-...-uuid

# 할 일 수정
$ memo update 1 -d "설명 변경" -t "긴급"

# 할 일 삭제
$ memo delete 2
```

- 데이터는 항상 `~/.memo/todo-data.json`에 저장됩니다.
- 번호는 현재 목록의 순서(1부터 시작)입니다.
- 더 많은 옵션은 `$ memo --help`로 확인하세요.
