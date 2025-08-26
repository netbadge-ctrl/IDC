import React, { useState, useEffect } from 'react';
import { WorkOrder, WorkOrderStatus } from '../types';
import Step from './Step';

interface WorkOrderDetailProps {
  order: WorkOrder;
  onGoBack: () => void;
  onUpdateOrder: (updatedOrder: WorkOrder) => void;
}

const ConfigCompare: React.FC<{ title: string; current: string[]; required: string[] }> = ({ title, current, required }) => {
    const isDifferent = JSON.stringify(current) !== JSON.stringify(required);
    return (
        <div>
            <h4 className="font-semibold text-gray-400 mt-2">{title}</h4>
            <div className={`p-2 rounded ${isDifferent ? 'bg-yellow-900/50' : 'bg-gray-700/50'}`}>
                <p className="text-sm text-gray-400">当前: {current.join(', ')}</p>
                {isDifferent && <p className="text-sm text-green-400">要求: {required.join(', ')}</p>}
            </div>
        </div>
    );
};

const ServerMotherboard: React.FC = () => {
    return (
        <div className="relative w-full max-w-sm mx-auto bg-gray-700 rounded-lg p-4 my-4 aspect-[4/3]">
            <div className="absolute top-4 left-4 w-20 h-20 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">CPU 1</div>
            <div className="absolute top-4 right-4 w-20 h-20 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">CPU 2</div>

            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`absolute w-20 h-4 bg-blue-900/80 border border-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-mono shadow-md ${i < 4 ? 'left-4' : 'right-4'}`} style={{top: `${90 + i%4 * 24}px`}}>
                    DIMM_{i < 4 ? 'A' : 'B'}{(i%4)+1}
                </div>
            ))}
             <p className="absolute bottom-2 left-4 text-sm text-blue-300">操作槽位: DIMM_A1-A4, DIMM_B1-B4</p>
        </div>
    )
}

const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ order, onGoBack, onUpdateOrder }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [snInput, setSnInput] = useState('');
  const [snVerified, setSnVerified] = useState(false);
  const [partScanInput, setPartScanInput] = useState('');

  useEffect(() => {
    // When a new order is selected, reset state
    setCurrentStep(1);
    setSnInput('');
    setSnVerified(false);
    setPartScanInput('');
  }, [order.id]);

  const completeStep = (step: number) => {
    setCurrentStep(step + 1);
  };
  
  // For simplicity, we'll operate on the first device in the list.
  const device = order.devices[0];

  const handleVerifySN = () => {
    if (device && snInput.trim().toUpperCase() === device.sn.toUpperCase()) {
        setSnVerified(true);
        alert('SN号验证成功!');
        completeStep(2);
    } else {
        alert('SN号不匹配，请重新扫描/输入。');
    }
  };
  
  const handleCompleteOrder = () => {
    onUpdateOrder({ ...order, status: WorkOrderStatus.COMPLETED });
    alert('工单已完成!');
    onGoBack();
  }

  const handleReportError = () => {
    onUpdateOrder({ ...order, status: WorkOrderStatus.ERROR });
    alert('异常已上报!');
    onGoBack();
  }
  
  if (!device) {
    return (
        <div className="p-4 max-w-2xl mx-auto text-gray-200">
             <div className="flex items-center mb-4">
                <button onClick={onGoBack} className="mr-4 text-blue-400 hover:text-blue-300">&larr; 返回</button>
                <h2 className="text-xl font-bold truncate">{order.title}</h2>
             </div>
             <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-center">
                <p>错误：此工单未关联任何设备。</p>
             </div>
        </div>
    )
  }

  return (
    <div className="p-4 max-w-2xl mx-auto text-gray-200">
      <div className="flex items-center mb-4">
        <button onClick={onGoBack} className="mr-4 text-blue-400 hover:text-blue-300">&larr; 返回</button>
        <h2 className="text-xl font-bold truncate">{order.title}</h2>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <p><strong>型号:</strong> {device.model}</p>
        <p><strong>位置:</strong> {device.location.module} / {device.location.rack} / U位 {device.location.u}</p>
        <p><strong>SN:</strong> {device.sn}</p>
      </div>

      {/* For Outsourced/SOP-driven tasks */}
      <div className="w-full">
        <Step stepNumber={1} title="准备工作：核对信息与领取配件" isCompleted={currentStep > 1} isLocked={false}>
          <h3 className="text-lg font-semibold mb-2">配置变更详情</h3>
          <ConfigCompare title="CPU" current={order.currentConfig.cpus} required={order.requiredConfig.cpus} />
          <ConfigCompare title="内存" current={order.currentConfig.memory} required={order.requiredConfig.memory} />
          <ConfigCompare title="硬盘" current={order.currentConfig.disks} required={order.requiredConfig.disks} />
          
          <h3 className="text-lg font-semibold mt-4 mb-2">所需配件</h3>
          <ul className="list-disc pl-5 text-gray-300">
            {order.requiredParts.map(item => (
                <li key={item.part.id}>
                    {item.part.type} - {item.part.model} (x{item.quantity})
                    <p className="text-xs text-cyan-400">库存位置: {item.part.location}</p>
                </li>
            ))}
          </ul>
          <button onClick={() => completeStep(1)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            确认领取配件
          </button>
        </Step>

        <Step stepNumber={2} title="定位与验证服务器" isCompleted={currentStep > 2} isLocked={currentStep < 2}>
            <h3 className="text-lg font-semibold mb-2">远程控制服务器指示灯</h3>
            <div className="flex space-x-2 mb-4">
                <button onClick={() => alert('服务器指示灯已设置为频闪')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">频闪</button>
                <button onClick={() => alert('服务器指示灯已设置为长亮')} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">长亮</button>
            </div>
             <h3 className="text-lg font-semibold mb-2">扫描/输入SN号验证</h3>
             <div className="flex">
                <input type="text" value={snInput} onChange={(e) => setSnInput(e.target.value)} placeholder="输入SN号" className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white"/>
                <button onClick={handleVerifySN} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md">验证</button>
             </div>
        </Step>

        <Step stepNumber={3} title="改配操作指引" isCompleted={currentStep > 3} isLocked={currentStep < 3}>
            <h3 className="text-lg font-semibold mb-2">可视化操作图示</h3>
            <ServerMotherboard />

            <h3 className="text-lg font-semibold mb-2">操作指引视频</h3>
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-gray-500 mb-4">
                [操作视频]
            </div>

            <h3 className="text-lg font-semibold mb-2">配件扫码验证</h3>
            <div className="flex">
                <input type="text" value={partScanInput} onChange={(e) => setPartScanInput(e.target.value)} placeholder="扫描配件条码" className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-2 focus:ring-blue-500 focus:border-blue-500 text-white"/>
                <button onClick={() => alert(`配件 ${partScanInput} 已验证`)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md">验证配件</button>
            </div>
             <button onClick={() => completeStep(3)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                硬件操作完成
            </button>
        </Step>

        <Step stepNumber={4} title="完结工单" isCompleted={currentStep > 4} isLocked={currentStep < 4}>
            <h3 className="text-lg font-semibold mb-2">带外配置</h3>
            <p className="text-sm text-gray-400 mb-4">请根据标准流程完成iDRAC/iLO等带外配置。</p>
            <div className="flex space-x-2">
                <button onClick={handleCompleteOrder} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded">
                    结单检测
                </button>
                <button onClick={handleReportError} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded">
                    异常处理
                </button>
            </div>
        </Step>
      </div>
    </div>
  );
};

// FIX: Add default export for the component.
export default WorkOrderDetail;