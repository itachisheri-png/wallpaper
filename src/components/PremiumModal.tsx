import { Check, Crown, Zap, Shield, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PremiumModal({ isOpen, onClose, onConfirm }: PremiumModalProps) {
  const features = [
    { icon: <Download className="h-5 w-5 text-indigo-400" />, text: 'Unlimited 4K Downloads' },
    { icon: <Crown className="h-5 w-5 text-amber-400" />, text: 'Exclusive Premium Collection' },
    { icon: <Zap className="h-5 w-5 text-blue-400" />, text: 'Ad-Free Experience' },
    { icon: <Shield className="h-5 w-5 text-green-400" />, text: 'Commercial Usage Rights' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-panel text-white p-0 overflow-hidden shadow-2xl border-white/20">
        <div className="relative h-32 bg-gradient-to-br from-indigo-600/60 to-purple-700/60 p-6 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl" />
          </div>
          <Crown className="h-16 w-16 text-white drop-shadow-2xl" />
        </div>

        <div className="p-8">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">Upgrade to Premium</DialogTitle>
            <DialogDescription className="text-zinc-400 mt-2">
              Unlock the full potential of 4K Vision and get access to exclusive high-resolution content.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-zinc-200">{feature.text}</span>
                <Check className="ml-auto h-4 w-4 text-zinc-500" />
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-4xl font-bold">$5</span>
              <span className="text-zinc-500">/month</span>
            </div>
            
            <Button 
              onClick={onConfirm}
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold text-lg rounded-xl transition-transform active:scale-95"
            >
              Start 7-Day Free Trial
            </Button>
            <p className="text-center text-xs text-zinc-500 mt-4">
              Cancel anytime. Secure checkout powered by Stripe.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
