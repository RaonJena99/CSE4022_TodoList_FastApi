# Python 3.9 베이스 이미지 사용
FROM python:3.9

# 새로운 사용자 생성
RUN useradd -m appuser

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일 복사
COPY . .

# 권한 부여 (읽기/쓰기)
RUN chmod 666 todo.json

# 의존성 설치
RUN pip install --no-cache-dir -r requirements.txt

# 사용자 전환
USER appuser

# FastAPI 서버 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5001"]
