
"use client";
import { useState } from 'react';
import { Select, message, Form, Spin } from 'antd';

const { Option } = Select;

const AddressSelector = () => {
  const form = Form.useFormInstance();

  const [cities, setCities] = useState<any[]>([]); // Lưu danh sách tỉnh thành
  const [districts, setDistricts] = useState<any[]>([]); // Lưu danh sách quận huyện
  const [communes, setCommunes] = useState<any[]>([]); // Lưu danh sách phường xã

  const [selectedCity, setSelectedCity] = useState<number | null>(null); // Thành phố đã chọn
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null); // Quận huyện đã chọn
  const [loadingCities, setLoadingCities] = useState<boolean>(false); // Trạng thái loading cho các tỉnh thành
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false); // Trạng thái loading cho quận huyện
  const [loadingCommunes, setLoadingCommunes] = useState<boolean>(false); // Trạng thái loading cho phường xã

  // Hàm xử lý khi tải dữ liệu tỉnh thành
  const fetchCities = async () => {
    setLoadingCities(true); // Bắt đầu loading
    try {
      const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
      const data = await response.json();
      if (data.error === 0) {
        setCities(data.data); // Cập nhật danh sách tỉnh thành
      } else {
        message.error("Không thể tải thông tin tỉnh/thành phố.");
      }
    } catch {
      message.error("Lỗi khi tải thông tin tỉnh/thành phố.");
    } finally {
      setLoadingCities(false); // Kết thúc loading
    }
  };

  // Hàm xử lý khi chọn thành phố
  const handleCityChange = async (cityId: number) => {
    form.setFieldsValue({ city: cityId, district: undefined, commune: undefined });
    setSelectedCity(cityId);
    setSelectedDistrict(null); // Reset quận huyện khi chọn lại thành phố
    setCommunes([]); // Reset phường xã
    setLoadingDistricts(true); // Bắt đầu loading quận huyện

    // Fetch quận huyện của thành phố đã chọn
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`);
      const data = await response.json();
      if (data.error === 0) {
        setDistricts(data.data); // Cập nhật danh sách quận huyện
      } else {
        message.error("Không thể tải thông tin quận/huyện.");
      }
    } catch {
      message.error("Lỗi khi tải thông tin quận/huyện.");
    } finally {
      setLoadingDistricts(false); // Kết thúc loading quận huyện
    }
  };

  // Hàm xử lý khi chọn quận huyện
  const handleDistrictChange = async (districtId: number) => {
    form.setFieldsValue({ district: districtId, commune: undefined });
    setSelectedDistrict(districtId);
    setCommunes([]); // Reset phường xã khi chọn lại quận huyện
    setLoadingCommunes(true); // Bắt đầu loading phường xã

    // Fetch phường xã của quận huyện đã chọn
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const data = await response.json();
      if (data.error === 0) {
        setCommunes(data.data); // Cập nhật danh sách phường xã
      } else {
        message.error("Không thể tải thông tin phường/xã.");
      }
    } catch {
      message.error("Lỗi khi tải thông tin phường/xã.");
    } finally {
      setLoadingCommunes(false); // Kết thúc loading phường xã
    }
  };

  // Hàm xử lý khi chọn phường xã
  const handleCommuneChange = (communeId: number) => {
    form.setFieldsValue({ commune: communeId });
  };

  return (
    <div className="flex gap-4 mb-4 w-full">
      <Form.Item
        name="city"
        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
        className="flex-1"
      >
        <div>
          <label className="block text-lg font-medium ">Tỉnh/Thành phố</label>
          <Select
            placeholder="Chọn tỉnh/thành phố"
            style={{ width: '100%' }}
            onChange={handleCityChange}
            onFocus={fetchCities} 
            loading={loadingCities} 
          >
            {cities.map((city) => (
              <Option key={city.id} value={city.id}>
                {city.full_name}
              </Option>
            ))}
          </Select>
        </div>
      </Form.Item>

      <Form.Item
        name="district"
        rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
        className="flex-1"
      >
        <div>
          <label className="block text-lg font-medium">Quận/Huyện</label>
          <Select
            placeholder="Chọn quận/huyện"
            style={{ width: '100%' }}
            onChange={handleDistrictChange}
            disabled={!selectedCity} 
            loading={loadingDistricts} 
          >
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.full_name}
              </Option>
            ))}
          </Select>
        </div>
      </Form.Item>

      <Form.Item
        name="commune"
        rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
        className="flex-1"
      >
        <div>
          <label className="block text-lg font-medium">Phường/Xã</label>
          <Select
            placeholder="Chọn phường/xã"
            style={{ width: '100%' }}
            onChange={handleCommuneChange}
            disabled={!selectedDistrict} // Disable dropdown nếu chưa chọn quận
            loading={loadingCommunes} // Hiển thị loading khi đang fetch phường xã
          >
            {communes.map((commune) => (
              <Option key={commune.id} value={commune.id}>
                {commune.full_name}
              </Option>
            ))}
          </Select>
        </div>
      </Form.Item>
    </div>
  );
};

export default AddressSelector;
