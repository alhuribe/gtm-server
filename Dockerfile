# استخدام إصدار Node.js ثابت ومستقر
FROM node:18-alpine

# تعيين سجل تفصيلي وتجنب التخزين المؤقت غير الضروري
RUN npm config set registry https://registry.npmjs.org/ && \
    npm set loglevel verbose

# إنشاء مجلد العمل
WORKDIR /usr/src/app

# نسخ ملفات التبعيات أولاً (لتحسين إعادة بناء الطبقات)
COPY package*.json ./

# تثبيت التبعيات مع تحسينات للأداء
RUN npm install --production --no-optional --prefer-offline

# نسخ باقي الملفات
COPY . .

# تعريض المنفذ
EXPOSE 8080

# أمر التشغيل
CMD ["node", "server.js"]
