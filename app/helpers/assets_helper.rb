# app/helpers/assets_helper.rb
module AssetsHelper
  def asset_manifest
    @asset_manifest ||= JSON.parse(File.read(Rails.root.join('public', 'packs', 'manifest.json')))
  end

  def webpack_asset_path(name)
    asset_manifest[name]
  end
end