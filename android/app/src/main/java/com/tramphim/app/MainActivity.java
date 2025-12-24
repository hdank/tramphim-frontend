package com.tramphim.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import android.view.Window;
import android.view.View;
import com.getcapacitor.BridgeActivity;
import com.tramphim.app.R;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		setTheme(R.style.AppTheme_NoActionBar);
		super.onCreate(savedInstanceState);
		enableImmersiveMode();
	}

	private void enableImmersiveMode() {
		Window window = getWindow();
		WindowCompat.setDecorFitsSystemWindows(window, false);
		View decor = window.getDecorView();
		WindowInsetsControllerCompat controller =
				WindowCompat.getInsetsController(window, decor);
		if (controller != null) {
			controller.hide(WindowInsetsCompat.Type.systemBars());
			controller.setSystemBarsBehavior(
					WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
		}
	}
}
