

"use client";
import { useState, useEffect } from "react";
import { Select, message, Form } from "antd";
import { Location } from "@/app/types";

const { Option } = Select;

interface AddressSelectorProps {
  form: any;
  cities: Location[];
  setCities: (cities: Location[]) => void;
  districts: Location[];
  setDistricts: (districts: Location[]) => void;
  communes: Location[];
  setCommunes: (communes: Location[]) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  form,
  cities,
  setCities,
  districts,
  setDistricts,
  communes,
  setCommunes,
}) => {
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  const fetchCities = async () => {
    if (cities.length > 0) return; // Tránh gọi lại
    setLoadingCities(true);
    try {
      const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
      const data = await response.json();
      if (data.error === 0) setCities(data.data as Location[]);
      else message.error("Không thể tải tỉnh/thành phố.");
    } catch {
      message.error("Lỗi tải tỉnh/thành phố.");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCityChange = async (cityId: number) => {
    form.setFieldsValue({ city: cityId, district: undefined, commune: undefined });
    setSelectedCity(cityId);
    setSelectedDistrict(null);
    setDistricts([]);
    setCommunes([]);

    setLoadingDistricts(true);
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${cityId}.htm`);
      const data = await response.json();
      if (data.error === 0) setDistricts(data.data as Location[]);
      else message.error("Không thể tải quận/huyện.");
    } catch {
      message.error("Lỗi tải quận/huyện.");
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleDistrictChange = async (districtId: number) => {
    form.setFieldsValue({ district: districtId, commune: undefined });
    setSelectedDistrict(districtId);
    setCommunes([]);

    setLoadingCommunes(true);
    try {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const data = await response.json();
      if (data.error === 0) setCommunes(data.data as Location[]);
      else message.error("Không thể tải phường/xã.");
    } catch {
      message.error("Lỗi tải phường/xã.");
    } finally {
      setLoadingCommunes(false);
    }
  };

  const handleCommuneChange = (communeId: number) => {
    form.setFieldsValue({ commune: communeId });
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 w-full">
      <Form.Item
        name="city"
        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
      >
        <div>
          <label className="block text-lg font-medium">Tỉnh/Thành phố</label>
          <Select
            placeholder="Chọn tỉnh/thành phố"
            onChange={handleCityChange}
            loading={loadingCities}
            className="rounded-lg w-full"
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
      >
        <div>
          <label className="block text-lg font-medium">Quận/Huyện</label>
          <Select
            placeholder="Chọn quận/huyện"
            onChange={handleDistrictChange}
            disabled={!selectedCity}
            loading={loadingDistricts}
            className="rounded-lg w-full"
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
      >
        <div>
          <label className="block text-lg font-medium">Phường/Xã</label>
          <Select
            placeholder="Chọn phường/xã"
            onChange={handleCommuneChange}
            disabled={!selectedDistrict}
            loading={loadingCommunes}
            className="rounded-lg w-full"
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
