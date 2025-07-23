import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div
          className="fixed inset-0 bg-black/40 transition-opacity"
          aria-hidden="true"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md bg-white shadow-xl p-6 flex flex-col">
                  <div className="flex justify-between items-center pb-2 mb-4 border-b-1 border-b-neutral-300">
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Add New Item
                    </Dialog.Title>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <p>
                      with asterisks (<span className="text-red-500">*</span>)
                      to indicate required fields
                    </p>
                    <form className="flex flex-col gap-2 mt-2">
                      <label>
                        Asset or Liability
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        defaultValue=""
                        className=" text-neutral-500 border-1 border-neutral-300 rounded-xs"
                      >
                        <option value="" disabled hidden selected>
                          Choose what you're adding
                        </option>
                      </select>
                      <label>
                        Item Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        className="border-1 border-neutral-300 rounded-xs"
                        placeholder='e.g., "Amex Credit Card"'
                      ></input>
                      <label>
                        Type<span className="text-red-500">*</span>
                      </label>
                      <select
                        defaultValue=""
                        className=" text-neutral-500 border-1 border-neutral-300 rounded-xs"
                      >
                        <option value="" disabled hidden selected>
                          Example options below
                        </option>
                      </select>
                      <label>
                        Amount<span className="text-red-500">*</span>
                      </label>
                      <input
                        className="border-1 border-neutral-300 rounded-xs"
                        placeholder="Enter Amount"
                        type="number"
                        min="0"
                      ></input>
                      <label>
                        Currency<span className="text-red-500">*</span>
                      </label>
                      <select
                        defaultValue=""
                        className=" text-neutral-500 border-1 border-neutral-300 rounded-xs"
                      >
                        <option value="" disabled hidden selected>
                          Select Currency
                        </option>
                      </select>
                      <label>
                        Date Acquired / Incurred
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="border-1 border-neutral-300 rounded-xs text-black"
                      />
                      <label>Reference URL</label>
                      <input
                        className="border-1 border-neutral-300 rounded-xs"
                        placeholder="Enter URL"
                        type="number"
                        min="0"
                      ></input>

                      <div className="flex flex-row gap-1 justify-end">
                        <button
                          className="border-1 border-neutral-300 p-1 w-[20%] rounded-[5px]"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-white bg-indigo-500 w-[20%] rounded-[5px]"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
