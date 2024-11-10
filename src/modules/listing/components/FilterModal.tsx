'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Filter, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Slider } from '@nextui-org/slider'
import { Input } from '@/components/ui/input'

const householdPrivacyTypes = [
  { value: 'Shared Room', label: 'Shared Room' },
  { value: 'Whole Place', label: 'Whole Place' },
  { value: 'Private Room', label: 'Private Room' },
]

const propertyStructureOptions = [
  { value: "Apartment", label: "Apartment" },
  { value: "Condominium", label: "Condominium" },
  { value: "Dormitory", label: "Dormitory" }
]

export default function Component({ 
  householdAmenities = [], 
  selectedFilter, 
  setSelectedFilter, 
  selectedPrivacyType, 
  setSelectedPrivacyType,
  selectedStructure,
  setSelectedStructure,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rooms,
  setRooms,
  beds,
  setBeds,
  setIsApplyFilter
}) {
  const [isStructureDropdownOpen, setIsStructureDropdownOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const increment = (value, setter) => setter(value + 1)
  const decrement = (value, setter) => setter(value > 0 ? value - 1 : 0)

  const clearFilters = () => {
    setSelectedFilter([]);
    setSelectedPrivacyType([]);
    setSelectedStructure([]);
    setMinPrice(0);
    setMaxPrice(30000);
    setRooms(1);
    setBeds(1);
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all" onClick={() => setIsOpen(true)}>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Filter</span>
            <Filter className="w-4 h-auto" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-xl font-bold text-gray-700">Filter Options</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Privacy Filter Section */}
          <div className="flex flex-col items-start space-y-4">
            <Label className="text-lg font-semibold text-gray-600">Type of Place</Label>
            <div className="w-full flex justify-center">
              <ToggleGroup type="multiple" value={selectedPrivacyType} className="flex gap-4 w-full border border-gray-300 rounded-lg">
                {householdPrivacyTypes.map((type) => (
                  <ToggleGroupItem
                    key={type.value}
                    value={type.value}
                    onClick={() => {
                      if (selectedPrivacyType.includes(type.value)) {
                        setSelectedPrivacyType(
                          selectedPrivacyType.filter((item) => item !== type.value)
                        )
                      } else {
                        setSelectedPrivacyType([...selectedPrivacyType, type.value])
                      }
                    }}
                    className="flex-1 px-4 py-6 rounded-lg hover:bg-gray-200 transition-all text-center"
                  >
                    {type.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <hr className="border-t border-gray-300" />

          {/* Price Range Filter Section */}
          <div className="flex flex-col items-start space-y-4">
            <Label className="text-lg font-semibold text-gray-600">Price Range</Label>
            <Slider
              step={100}
              minValue={0}
              maxValue={30000}
              value={[minPrice, maxPrice]}
              onChange={(value) => {
                setMinPrice(value[0])
                setMaxPrice(value[1])
              }}
              formatOptions={{ style: "currency", currency: "PHP" }}
              className="w-full"
            />
            <div className="flex justify-between items-center w-full">
              <div className="flex-1 text-center">
                <Label className="block mb-2">Minimum</Label>
                <Input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded-full text-center"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
              </div>

              {/* Divider */}
              <span className="px-20"></span>

              <div className="flex-1 text-center">
                <Label className="block mb-2">Maximum</Label>
                <Input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded-full text-center"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300" />

          {/* Amenities Filter Section */}
          <div className="flex flex-col items-start space-y-4">
            <Label className="text-lg font-semibold text-gray-600">Amenities</Label>
            <ToggleGroup type="multiple" value={selectedFilter} className="grid gap-4 grid-cols-3 md:grid-cols-3">
              {householdAmenities.map((type) => (
                <ToggleGroupItem
                  key={type.id}
                  value={type.value}
                  onClick={() => {
                    if (selectedFilter.includes(type.value)) {
                      setSelectedFilter(
                        selectedFilter.filter((item) => item !== type.value)
                      )
                    } else {
                      setSelectedFilter([...selectedFilter, type.value])
                    }
                  }}
                  className="px-6 py-2 hover:border-gray-500 rounded-full border border-gray-300 transition-all"
                >
                  {type.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <hr className="border-t border-gray-300" />

          {/* Rooms and Beds Filter Section */}
          <div>
            <Label className="text-lg font-semibold text-gray-600">Rooms and Beds</Label>
            <div className="flex flex-col items-start space-y-4">
              {/* Number of Rooms Filter Section */}
              <div className="flex items-center justify-between w-full">
                <Label className="text-md font-medium text-gray-600">Bedrooms</Label>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => decrement(rooms, setRooms)} 
                    className="px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
                  >
                    -
                  </Button>
                  <span className="text-xl font-medium flex items-center justify-center w-[40px]">{rooms === 0 ? "Any" : rooms}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => increment(rooms, setRooms)} 
                    className="px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Number of Beds Filter Section */}
              <div className="flex items-center justify-between w-full">
                <Label className="text-md font-medium text-gray-600">Beds</Label>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => decrement(beds, setBeds)} 
                    className="px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
                  >
                    -
                  </Button>
                  <span className="text-xl font-medium flex items-center justify-center w-[40px]">{beds === 0 ? "Any" : beds}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => increment(beds, setBeds)} 
                    className="px-4 py-2 rounded-full hover:bg-gray-200 transition-all"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300" />

          {/* Structure Filter Section */}
          <div className="flex flex-col items-start space-y-4">
            <Button
              variant="primary"
              className="w-full text-left flex justify-between items-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-all"
              onClick={() => setIsStructureDropdownOpen((prev) => !prev)}
            >
              <Label className="text-lg font-semibold text-gray-600">Property Structure</Label>
              <ChevronDown className={`w-4 h-4 ${isStructureDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isStructureDropdownOpen && (
              <div className="w-full flex justify-center">
                <ToggleGroup 
                  type="multiple" 
                  value={selectedStructure}
                  className="flex gap-4 w-full border border-gray-300 rounded-lg"
                >
                  {propertyStructureOptions.map((type) => (
                    <ToggleGroupItem
                      key={type.value}
                      value={type.value}
                      onClick={() => {
                        if (selectedStructure.includes(type.value)) {
                          setSelectedStructure(
                            selectedStructure.filter((item) => item !== type.value)
                          )
                        } else {
                          setSelectedStructure([...selectedStructure, type.value])
                        }
                      }}
                      className="flex-1 px-4 py-6 rounded-lg hover:bg-gray-200 transition-all text-center"
                    >
                      {type.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
          </div>
        </div>

        {/* Clear Filter Button */}
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" className="py-2 rounded-lg border-gray-300 hover:bg-gray-100 transition-all" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button 
            variant="primary" 
            className="py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all" 
            onClick={() => {
              setIsApplyFilter(true);
              setIsOpen(false);
            }}
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}