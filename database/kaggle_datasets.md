# Hướng dẫn sử dụng Kaggle Datasets cho Sử Chill

## 1. Vietnam War Bombing Operations (THOR Database)
- **URL**: [https://www.kaggle.com/datasets/usaf/vietnam-war-bombing-operations](https://www.kaggle.com/datasets/usaf/vietnam-war-bombing-operations)
- **Mô tả**: Cơ sở dữ liệu THOR (Theater History of Operations Reports) chứa chi tiết hơn 4.8 triệu phi vụ ném bom của Mỹ trong chiến tranh Việt Nam.
- **Cách download**: Đăng nhập Kaggle, vào link trên và nhấn "Download".
- **Dữ liệu chính**: Ngày tháng, loại máy bay, kinh độ/vĩ độ mục tiêu, loại vũ khí, và trọng lượng bom.
- **Ứng dụng cho Sử Chill**: 
  - Tạo bản đồ nhiệt (heatmap) ném bom tương tác.
  - Xây dựng timeline trực quan cho các chiến dịch không kích (như Linebacker I & II, Rolling Thunder).
- **Script import vào PostgreSQL**:
  ```sql
  COPY bombing_operations(mission_date, aircraft, target_lat, target_lon, weapon, weight)
  FROM '/path/to/THOR_Vietnam_Bombing_Operations.csv'
  DELIMITER ','
  CSV HEADER;
  ```

## 2. Vietnam War Time Operations
- **URL**: [https://www.kaggle.com/datasets/jonatlantis/vietnam-war-time-operations](https://www.kaggle.com/datasets/jonatlantis/vietnam-war-time-operations)
- **Mô tả**: Tổng hợp dữ liệu liên quan đến các cuộc hành quân, trận đánh, và thông tin địa lý liên quan đến chiến tranh Việt Nam.
- **Cách download**: Đăng nhập Kaggle và tải file ZIP.
- **Dữ liệu chính**: Tên chiến dịch, tọa độ, thời gian bắt đầu và kết thúc, đơn vị tham gia.
- **Ứng dụng cho Sử Chill**: Xây dựng cơ sở dữ liệu các chiến dịch quân sự, hiển thị tuyến thời gian các sự kiện trên bản đồ 3D.
- **Script import vào PostgreSQL**:
  ```sql
  COPY military_operations(operation_name, start_date, end_date, lat, lon)
  FROM '/path/to/operations.csv'
  DELIMITER ','
  CSV HEADER;
  ```

## 3. DCAS Casualty Data (National Archives)
- **URL**: [National Archives - Vietnam War Casualties](https://www.archives.gov/research/military/vietnam-war/casualty-statistics)
- **Mô tả**: Dữ liệu thương vong của lính Mỹ trong Chiến tranh Việt Nam.
- **Cách download**: Tải trực tiếp từ cổng thông tin của National Archives.
- **Dữ liệu chính**: Tên, quê quán, ngày tử trận, nguyên nhân.
- **Ứng dụng cho Sử Chill**: Hiển thị thống kê về mức độ khốc liệt của cuộc chiến tại các địa phương cụ thể.

## 4. ViCoW Image Dataset (Nếu có / Cần tìm kiếm mở rộng)
- **Mô tả**: Các bộ dữ liệu hình ảnh liên quan đến chiến tranh Việt Nam cho việc huấn luyện AI hoặc nhận diện hình ảnh, vũ khí.
- **Ứng dụng cho Sử Chill**: Dùng để làm nguồn ảnh hoặc mô hình AI (nhận diện vũ khí, trang phục lính).

## Hướng dẫn Import vào PostgreSQL

Để chuẩn bị dữ liệu và import vào PostgreSQL, bạn nên làm theo các bước sau:
1. **Làm sạch dữ liệu**: Sử dụng Python (Pandas) để lọc bỏ các hàng có giá trị rỗng hoặc không cần thiết (ví dụ: tọa độ rỗng).
2. **Định dạng lại**: Chuyển định dạng ngày tháng về chuẩn `YYYY-MM-DD` để Postgres dễ xử lý.
3. **Tạo bảng**:
   ```sql
   CREATE TABLE bombing_operations (
       id SERIAL PRIMARY KEY,
       mission_date DATE,
       aircraft VARCHAR(50),
       target_lat DECIMAL,
       target_lon DECIMAL,
       weapon VARCHAR(100),
       weight DECIMAL
   );
   ```
4. **Import bằng công cụ**: Sử dụng lệnh `\copy` trong `psql` hoặc tính năng Import của pgAdmin.
   ```bash
   psql -U username -d suchill_db -c "\copy bombing_operations FROM 'data.csv' CSV HEADER;"
   ```
