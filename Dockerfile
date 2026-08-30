FROM nikolaik/python-nodejs:python3.12-nodejs20-slim

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY frontend/package.json ./frontend/package.json
RUN cd frontend && npm install

COPY frontend ./frontend
ENV INTERNAL_API_BASE_URL=http://127.0.0.1:8000
ENV NEXT_PUBLIC_API_BASE_URL=/api
RUN cd frontend && npm run build

COPY backend ./backend

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

ENV PORT=3000
EXPOSE 3000

CMD ["./start.sh"]
