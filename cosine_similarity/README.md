## 데이터 설명

### cosine_similarity_모델명.json

모델별로 cosine similarity 연산 결과

사람1 번호 - 사람1 사진 번호 - (phone / tablet) - 사람 2 번호 - 사람 2 사진 번호 순으로 이루어져 있음.

사람 1의 신분증(으로 간주되는 camera 데이터)과 사람 2의 얼굴 촬영 사진(으로 간주되는 phone, tablet 데이터)을 비교.

모델 10개 중 embedding이 단 하나도 되지 않은 모델 두 개를 제외하고 비교함.

----------------------

### cosine_similarity_stats_모델명.json

같은 사람을 비교했을 때와 다른 사람을 비교했을 때의 최대값, 최소값, 평균, 표준편차.

-------------------------

### percentile.json

같은 사람을 비교했을 때와 다른 사람을 비교했을 때의 99, 95, 50, 5, 1 퍼센트 분포

-----------------------

### compare.txt

percentile.json 분석(?)한 파일

