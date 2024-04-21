## 데이터 설명

### 데이터셋
https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=&topMenu=&aihubDataSe=data&dataSetSn=168

파일 목록에서 0006-0236만 다운받아 사용함.

(번호(사람구분)) -> (Phone, Tablet, Camera) - (Light 3가지) -> (crop, full) 로 구분되어 있음.

cosine similarity가 너무 안 나와서 Light 3가지 중에서는 Light_02_Mid만 사용.

full 이미지만 사용.

Camera의 attack 1번을 신분증 사진으로 간주, phone, tablet을 직접 찍은 얼굴 사진으로 간주.

데이터 사용할 때 폴더 이름 잘못된 것 있으니 다 체크하고 수정해서 사용해야 함.

--------------------

### embedding_모델명.json

각 모델에 따라 embedding한 결과임.

deepface에서 detector_backend 인자에는 'retinaface' 넣음(이리저리 돌려보니 제일 잘 되는 것 같아서. 이것도 비교해야 하지만 시간 관계상 모델만 비교).

embedding에 실패했을 경우 fail로 표시되어 있음.

----------------------

### embedding_time_모델명.json

embedding할 때 걸린 시간을 측정. 4090 서버 사용. 마찬가지로 embedding에 실패했을 경우 fail로 표시되어 있음.

-------------------------

### embedding_time_stats.json

각 모델별로 embedding할 때 걸린 시간 평균과 표준편차 표기.

-----------------------

### 기타

cosine similarity 연산 결과 다 도는대로 올릴 예정. 넉넉잡아 이틀 소요될 것으로 추정됨. 참고로 DeepFace 모델과 Dlib 모델은 모두 embedding에 실패해서 모델 8개로 연산할 예정.