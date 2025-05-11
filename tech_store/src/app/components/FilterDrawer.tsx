'use client';
import { Drawer, Button, Checkbox } from 'antd';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  brands: string[];
  selectedBrands: string[];
  handleBrandChange: (brand: string) => void;
  resetFilters: () => void;
  priceRange: number[];
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  visible,
  onClose,
  brands,
  selectedBrands,
  handleBrandChange,
  resetFilters,
  priceRange,
}) => {
  return (
    <Drawer
      title="Bộ lọc sản phẩm"
      placement="right"
      onClose={onClose}
      open={visible}
      width={300}
      footer={
        <div className="flex space-x-2">
          <Button onClick={resetFilters} className="flex-1 !rounded-button whitespace-nowrap">
            Xóa bộ lọc
          </Button>
          <Button type="primary" className="flex-1 bg-blue-600 !rounded-button whitespace-nowrap">
            Áp dụng
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Khoảng giá</h4>
          <div className="flex items-center justify-between">
            <div className="text-sm">0₫</div>
            <div className="text-sm">50.000.000₫</div>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Hãng sản xuất</h4>
          <div className="space-y-2">
            {brands.map((brand, index) => (
              <div key={index} className="flex items-center">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <span className="ml-2">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;