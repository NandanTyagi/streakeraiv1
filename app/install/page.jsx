import AddToHomeScreen from '@/components/AddToHomeScreen';
import IosInstallPrompt from '@/components/IosInstallPrompt';

export default function HomePage() {
  return (
    <div>
      {/* Your app content */}
      <IosInstallPrompt />
      <AddToHomeScreen />
    </div>
  );
}
