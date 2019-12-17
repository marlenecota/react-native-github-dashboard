#include "pch.h"
#include "ReactPackageProvider.h"

#include "NativeModules.h"



using namespace winrt::Microsoft::ReactNative::Bridge;

namespace winrt::src::implementation
{

void ReactPackageProvider::CreatePackage(IReactPackageBuilder const &packageBuilder) noexcept
{
    AddAttributedModules(packageBuilder);
}

} // namespace winrt::src::implementation


